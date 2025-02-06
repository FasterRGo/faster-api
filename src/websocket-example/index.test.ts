const io = require("socket.io-client");

// Substitua pela URL do WebSocket do seu backend
const socket = io("ws://localhost:3030", {
  transports: ["websocket"],
});

const locations = [
  { lat: -23.5428, lng: -46.31 },
  { lat: -23.5445, lng: -46.3242 },
  { lat: -23.5407, lng: -46.3091 },
];

let index = 0;

socket.on("connect", () => {
  console.log("✅ Conectado ao servidor WebSocket!");

  const data = {
    roomName: "5330331f-9481-4e55-802c-18b497713dca",
    invite: 138,
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
