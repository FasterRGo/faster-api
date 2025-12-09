import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ScheduledRideData {
  driverEmail: string;
  initialLatitude: number;
  initialLongitude: number;
  finalLatitude: number;
  finalLongitude: number;
  originCity: string;
  destinationCity: string;
  originLabel: string;
  destinationLabel: string;
  price: number;
  maxPassengers: number;
}

const scheduledRidesData: ScheduledRideData[] = [
  {
    driverEmail: "carlos.silva.driver@gmail.com",
    initialLatitude: -23.5505,
    initialLongitude: -46.6333,
    finalLatitude: -23.5329,
    finalLongitude: -46.6395,
    originCity: "São Paulo",
    destinationCity: "São Paulo",
    originLabel: "Praça da Sé, São Paulo - SP",
    destinationLabel: "Avenida Paulista, São Paulo - SP",
    price: 25.50,
    maxPassengers: 4,
  },
  {
    driverEmail: "maria.santos.driver@gmail.com",
    initialLatitude: -23.5505,
    initialLongitude: -46.6333,
    finalLatitude: -22.9068,
    finalLongitude: -43.1729,
    originCity: "São Paulo",
    destinationCity: "Rio de Janeiro",
    originLabel: "Praça da Sé, São Paulo - SP",
    destinationLabel: "Copacabana, Rio de Janeiro - RJ",
    price: 350.00,
    maxPassengers: 3,
  },
  {
    driverEmail: "joao.oliveira.driver@gmail.com",
    initialLatitude: -23.5505,
    initialLongitude: -46.6333,
    finalLatitude: -23.4695,
    finalLongitude: -46.5338,
    originCity: "São Paulo",
    destinationCity: "São Paulo",
    originLabel: "Centro, São Paulo - SP",
    destinationLabel: "Aeroporto de Congonhas, São Paulo - SP",
    price: 45.00,
    maxPassengers: 4,
  },
  {
    driverEmail: "ana.costa.driver@gmail.com",
    initialLatitude: -23.5505,
    initialLongitude: -46.6333,
    finalLatitude: -23.6273,
    finalLongitude: -46.6556,
    originCity: "São Paulo",
    destinationCity: "São Paulo",
    originLabel: "Centro, São Paulo - SP",
    destinationLabel: "Shopping Center Norte, São Paulo - SP",
    price: 30.00,
    maxPassengers: 4,
  },
  {
    driverEmail: "roberto.pereira.driver@gmail.com",
    initialLatitude: -23.5505,
    initialLongitude: -46.6333,
    finalLatitude: -23.5505,
    finalLongitude: -46.6333,
    originCity: "São Paulo",
    destinationCity: "São Paulo",
    originLabel: "Praça da Sé, São Paulo - SP",
    destinationLabel: "Parque Ibirapuera, São Paulo - SP",
    price: 35.00,
    maxPassengers: 4,
  },
];

export async function DefaultScheduledRides() {
  const scheduledDate = "01/01/2026";
  let createdCount = 0;
  let skippedCount = 0;

  for (const rideData of scheduledRidesData) {
    try {
      // Buscar o motorista pelo email
      const driver = await prisma.driver.findUnique({
        where: { email: rideData.driverEmail },
      });

      if (!driver) {
        console.log(`⏭️  Motorista ${rideData.driverEmail} não encontrado, pulando corrida`);
        skippedCount++;
        continue;
      }

      // Verificar se já existe uma scheduledRide com os mesmos dados para este motorista
      const existingRide = await prisma.scheduledRide.findFirst({
        where: {
          driverId: driver.id,
          scheduledDate: scheduledDate,
          initialLatitudeLocation: rideData.initialLatitude,
          initialLongitudeLocation: rideData.initialLongitude,
          finalLatitudeLocation: rideData.finalLatitude,
          finalLongitudeLocation: rideData.finalLongitude,
        },
      });

      if (existingRide) {
        console.log(`⏭️  Corrida agendada já existe para ${driver.name} em ${scheduledDate}`);
        skippedCount++;
        continue;
      }

      // Criar a scheduledRide
      await prisma.scheduledRide.create({
        data: {
          driverId: driver.id,
          initialLatitudeLocation: rideData.initialLatitude,
          initialLongitudeLocation: rideData.initialLongitude,
          finalLatitudeLocation: rideData.finalLatitude,
          finalLongitudeLocation: rideData.finalLongitude,
          originCity: rideData.originCity,
          destinationCity: rideData.destinationCity,
          originLabel: rideData.originLabel,
          destinationLabel: rideData.destinationLabel,
          price: rideData.price,
          scheduledDate: scheduledDate,
          maxPassengers: rideData.maxPassengers,
          status: "CREATED",
        },
      });

      createdCount++;
      console.log(
        `✅ Corrida agendada criada para ${driver.name} - ${rideData.originCity} → ${rideData.destinationCity} em ${scheduledDate}`
      );
    } catch (error: any) {
      console.error(`❌ Erro ao criar corrida agendada para ${rideData.driverEmail}:`, error.message);
      skippedCount++;
    }
  }

  console.log(`\n📊 Resumo ScheduledRides: ${createdCount} corridas criadas, ${skippedCount} já existiam ou foram puladas`);
}

