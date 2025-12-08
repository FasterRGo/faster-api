import { io } from "socket.io-client";

// Substitua pela URL do WebSocket do seu backend
const socket = io("ws://localhost:3030", {
  transports: ["websocket"],
});

// Gera 10 locations em linha reta entre dois pontos (A e B)
const start = { lat: -23.5428, lng: -46.31 };
const end = { lat: -23.5328, lng: -46.29 };

const locations: Array<{ lat: number; lng: number }> = [];
const steps = 9; // 10 pontos => 9 intervalos

for (let i = 0; i <= steps; i++) {
  const lat = start.lat + ((end.lat - start.lat) * i) / steps;
  const lng = start.lng + ((end.lng - start.lng) * i) / steps;
  locations.push({
    lat: parseFloat(lat.toFixed(6)),
    lng: parseFloat(lng.toFixed(6)),
  });
}

let index = 0;

socket.on("connect", () => {
  console.log("✅ Conectado ao servidor WebSocket!");

  const data = {
    roomName: "d7a129e5-c38b-4238-9443-9b070ceb11f0",
    invite: 25,
    message: "Tranquilo?",
    location: locations[index],
  };

  socket.emit("acceptRide", data);
  console.log("🚕 Corrida aceita:", data);

  // Enviar localização a cada 3 segundos
  const interval = setInterval(() => {
    if (index >= locations.length) {
      clearInterval(interval);
      console.log("✅ Envio finalizado.");
      return;
    }

    const updatedData = { ...data, location: locations[index] };

    socket.emit("updateLocation", updatedData);
    console.log("📍 Localização enviada:", updatedData);

    index++; // Atualiza o índice para a próxima localização
  }, 3000);
});
