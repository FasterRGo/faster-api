import { io } from "../index";
import { prisma } from "./prisma";
import {
  acceptRide,
  initializeRide,
  finishRide,
} from "../database/repositories/rideRepository";

/**
 * Gera posição inicial do motorista (um pouco afastada da origem)
 */
function generateDriverStartPosition(
  originLat: number,
  originLng: number,
  distanceKm: number = 2 // 2km de distância
): { lat: number; lng: number } {
  // Aproximadamente 1 grau de latitude = 111km
  // Para longitude, depende da latitude, mas vamos usar uma aproximação
  const latOffset = (distanceKm / 111) * 0.5; // Offset menor para latitude
  const lngOffset = (distanceKm / 111) * 0.7; // Offset maior para longitude (ajustado para Brasil)

  return {
    lat: parseFloat((originLat - latOffset).toFixed(6)),
    lng: parseFloat((originLng - lngOffset).toFixed(6)),
  };
}

/**
 * Gera localizações interpoladas entre dois pontos
 */
function generateLocationsBetweenPoints(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  count: number
): Array<{ lat: number; lng: number }> {
  const locations: Array<{ lat: number; lng: number }> = [];
  const steps = count - 1;

  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    const lat = startLat + (endLat - startLat) * ratio;
    const lng = startLng + (endLng - startLng) * ratio;
    locations.push({
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
    });
  }

  return locations;
}

/**
 * Gera localizações completas: motorista -> origem -> destino
 */
function generateCompleteRoute(
  originLat: number,
  originLng: number,
  destinationLat: number,
  destinationLng: number,
  totalLocations: number = 20
): Array<{ lat: number; lng: number }> {
  // Posição inicial do motorista (vindo buscar o passageiro)
  const driverStart = generateDriverStartPosition(originLat, originLng, 2);

  // Dividir as localizações: 40% para ir até a origem, 60% para ir ao destino
  const toOriginCount = Math.floor(totalLocations * 0.4); // ~8 localizações
  const toDestinationCount = totalLocations - toOriginCount; // ~12 localizações

  // Fase 1: Motorista vai até o ponto de origem (buscar passageiro)
  const toOriginLocations = generateLocationsBetweenPoints(
    driverStart.lat,
    driverStart.lng,
    originLat,
    originLng,
    toOriginCount
  );

  // Fase 2: Motorista vai do ponto de origem até o destino (com passageiro)
  const toDestinationLocations = generateLocationsBetweenPoints(
    originLat,
    originLng,
    destinationLat,
    destinationLng,
    toDestinationCount
  );

  // Combinar ambas as fases
  return [...toOriginLocations, ...toDestinationLocations];
}

/**
 * Serviço de demo automático para corridas
 * Quando IS_DEMO=true, automaticamente aceita, conecta, envia localizações e finaliza
 */
export async function handleDemoRide(rideId: string, roomId: string) {
  const IS_DEMO = process.env.IS_DEMO === "true";

  if (!IS_DEMO) {
    return; // Demo desativado
  }

  console.log("\n" + "=".repeat(60));
  console.log(
    `🚀 [MODO DEMO] Iniciando demo automático para corrida ${rideId}`
  );
  console.log("=".repeat(60));

  try {
    // 1. Buscar a corrida
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
      include: {
        User: true,
      },
    });

    if (!ride) {
      console.error(`❌ [MODO DEMO] Corrida ${rideId} não encontrada`);
      console.log("=".repeat(60) + "\n");
      return;
    }

    // 2. Buscar um motorista disponível (ou o primeiro do seed)
    let driver = await prisma.driver.findFirst({
      where: {
        isWorking: false,
      },
      include: {
        car: {
          take: 1,
        },
      },
    });

    // Se não houver motorista disponível, pega o primeiro
    if (!driver) {
      driver = await prisma.driver.findFirst({
        include: {
          car: {
            take: 1,
          },
        },
      });
    }

    if (!driver) {
      console.error(`❌ [MODO DEMO] Nenhum motorista encontrado para demo`);
      console.log("=".repeat(60) + "\n");
      return;
    }

    console.log(
      `✅ [MODO DEMO] Motorista selecionado: ${driver.name} (ID: ${driver.id})`
    );

    // 3. Aguardar 5 segundos antes de aceitar a corrida (para dar tempo do usuário ver o contador)
    console.log(
      `⏳ [MODO DEMO] Aguardando 5 segundos antes de aceitar a corrida...`
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Atualizar o driverId na corrida (igual ao AcceptRideController)
    await prisma.ride.update({
      where: { id: rideId },
      data: { driverId: driver.id },
    });

    // Atualizar o status do motorista para isWorking: false
    await prisma.driver.update({
      where: { id: driver.id },
      data: { isWorking: false },
    });

    // Aceitar a corrida (já cria o invite automaticamente)
    const rideUpdated = await acceptRide(driver.id, rideId);

    console.log(`✅ [MODO DEMO] Corrida aceita pelo motorista ${driver.name}`);
    console.log(`   driverId atualizado na corrida: ${driver.id}`);

    // Aguardar para garantir que o usuário está conectado na sala (o app chama joinRoom após criar a corrida)
    console.log(
      `⏳ [MODO DEMO] Aguardando 3 segundos para usuário entrar na sala...`
    );
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Emitir evento de motorista aceitou (mesmo formato do AcceptRideController)
    if (rideUpdated.Driver && roomId) {
      const driverData = {
        Driver: rideUpdated.Driver,
      };

      console.log(`📡 [MODO DEMO] Preparando para emitir driverJoined`);
      console.log(
        `   Driver completo:`,
        JSON.stringify(rideUpdated.Driver, null, 2)
      );
      console.log(`   Driver.name: ${rideUpdated.Driver.name}`);
      console.log(`   Driver.photo: ${rideUpdated.Driver.photo}`);
      console.log(`   Driver.car:`, rideUpdated.Driver.car);
      console.log(
        `   Driver.car tipo:`,
        Array.isArray(rideUpdated.Driver.car)
          ? "Array"
          : typeof rideUpdated.Driver.car
      );

      // Emitir múltiplas vezes para garantir que seja recebido
      io.to(roomId).emit("driverJoined", driverData);

      // Também emitir após um pequeno delay adicional
      setTimeout(() => {
        io.to(roomId).emit("driverJoined", driverData);
        console.log(`📡 [MODO DEMO] Evento 'driverJoined' re-emitido após 1s`);
      }, 1000);

      console.log(
        `📡 [MODO DEMO] Evento 'driverJoined' emitido para a sala ${roomId}`
      );
      console.log(`   Motorista: ${rideUpdated.Driver.name}`);
      console.log(
        `   Carro: ${rideUpdated.Driver.car?.[0]?.model || "N/A"} - ${
          rideUpdated.Driver.car?.[0]?.plate || "N/A"
        }`
      );
    } else {
      console.warn(
        `⚠️ [MODO DEMO] Não foi possível emitir driverJoined - Driver ou roomId ausente`
      );
      console.log(`   Driver:`, rideUpdated.Driver ? "presente" : "ausente");
      console.log(`   roomId:`, roomId || "ausente");
      if (rideUpdated.Driver) {
        console.log(`   Driver estrutura:`, Object.keys(rideUpdated.Driver));
      }
    }

    // 4. Gerar localizações completas: motorista -> origem (buscar) -> destino
    const locations = generateCompleteRoute(
      ride.initialLatitudeLocation,
      ride.initialLongitudeLocation,
      ride.finalLatitudeLocation,
      ride.finalLongitudeLocation,
      20
    );

    console.log(`📍 [MODO DEMO] Geradas ${locations.length} localizações`);
    const toOriginCount = Math.floor(locations.length * 0.4);
    console.log(
      `   → Primeira fase: Motorista indo buscar passageiro (${toOriginCount} localizações)`
    );
    console.log(
      `   → Segunda fase: Motorista indo ao destino (${
        locations.length - toOriginCount
      } localizações)`
    );

    // 5. Enviar localizações via WebSocket com intervalo de 2 segundos
    let locationIndex = 0;
    let rideInitialized = false; // Flag para garantir que initializeRide seja chamado apenas uma vez
    const sendLocation = () => {
      if (locationIndex >= locations.length) {
        // Todas as localizações foram enviadas, finalizar corrida
        setTimeout(async () => {
          try {
            console.log(`🏁 [MODO DEMO] Finalizando corrida ${rideId}...`);
            const finishedRide = await finishRide(rideId, io);
            console.log(
              `✅ [MODO DEMO] Corrida ${rideId} finalizada automaticamente`
            );
            console.log(`   Status: ${finishedRide.status}`);
            console.log(
              `   Room ativo: ${finishedRide.Room?.active ? "Sim" : "Não"}`
            );
            console.log("=".repeat(60) + "\n");
          } catch (error) {
            console.error(`❌ [MODO DEMO] Erro ao finalizar corrida:`, error);
            console.log("=".repeat(60) + "\n");
          }
        }, 2000);
        return;
      }

      const location = locations[locationIndex];

      // Verifica se o motorista chegou ao ponto de origem (último ponto da primeira fase)
      const isAtOrigin = locationIndex >= toOriginCount - 1; // Último ponto da primeira fase
      if (isAtOrigin && !rideInitialized) {
        try {
          console.log(
            `🚨 [MODO DEMO] Motorista chegou ao ponto de origem. Inicializando corrida...`
          );
          initializeRide(rideId, io); // Altera o status da corrida para INITIALIZED
          rideInitialized = true;

          // Emite evento para o frontend saber que o motorista chegou
          io.to(roomId).emit("driverReady", {
            rideId,
            message: "Motorista chegou ao local de partida.",
            location: location,
          });
          console.log(
            `📡 [MODO DEMO] Evento 'driverReady' emitido para a sala ${roomId}`
          );
        } catch (error) {
          console.error(`❌ [MODO DEMO] Erro ao inicializar corrida:`, error);
        }
      }

      // Emitir localização via WebSocket
      io.to(roomId).emit("updateLocation", {
        roomName: roomId,
        location: location,
        driverId: driver.id,
      });

      // Também emitir o evento específico que o frontend espera
      io.to(roomId).emit("onDriverUpdateLocation", {
        location: location,
        driverId: driver.id,
      });

      console.log(
        `📍 [MODO DEMO] Localização ${locationIndex + 1}/${
          locations.length
        } enviada:`,
        location
      );

      locationIndex++;

      // Próxima localização em 2 segundos
      setTimeout(sendLocation, 2000);
    };

    // Iniciar envio de localizações após 1 segundo
    setTimeout(sendLocation, 1000);
  } catch (error: any) {
    console.error(`❌ [MODO DEMO] Erro no processo de demo:`, error);
    console.log("=".repeat(60) + "\n");
  }
}
