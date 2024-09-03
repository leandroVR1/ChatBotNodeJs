// Función para enviar una ubicación
async function sendLocation(to) {
  const locationMessage = {
    messaging_product: "whatsapp",
    to: to,
    type: "location",
    location: {
      latitude: "40.712776",
      longitude: "-74.005974",
      name: "Nueva York",
      address: "New York, NY, USA",
    },
  };

  await sendMessage(locationMessage);
}