require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const { GRAPH_API_TOKEN, BUSINESS_PHONE_NUMBER_ID } = process.env;

let lastInteraction = {}; // Almacena la última interacción de cada usuario

// Función para enviar un mensaje a través de la API de WhatsApp
async function sendMessage(to, message) {
  try {
    const response = await axios.post(`https://graph.facebook.com/v18.0/${BUSINESS_PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp",
      to,
      text: { body: message },
    }, {
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error.response ? error.response.data : error.message);
  }
}

// Ruta para el webhook
app.post("/webhook", async (req, res) => {
  const changes = req.body.entry[0].changes[0].value;
  
  if (changes.messages) {
    const message = changes.messages[0];
    const from = message.from; // Número de teléfono del usuario
    const text = message.text.body.toLowerCase(); // Texto del mensaje recibido

    if (!lastInteraction[from] || message.timestamp - lastInteraction[from] > 86400) {
      // Si es la primera interacción o ha pasado más de 24 horas desde la última
      await sendMessage(from, "¡Hola! Bienvenido a nuestro chatbot.");
      await sendMessage(from, "Elige una de las siguientes opciones:\n1. Opción 1\n2. Opción 2\n3. Opción 3");
    } else if (text === "1") {
      await sendMessage(from, "Has seleccionado la Opción 1.");
    } else if (text === "2") {
      await sendMessage(from, "Has seleccionado la Opción 2.");
    } else if (text === "3") {
      await sendMessage(from, "Has seleccionado la Opción 3.");
    } else {
      await sendMessage(from, "Opción no válida. Por favor, elige 1, 2, o 3.");
    }

    lastInteraction[from] = message.timestamp; // Actualiza la última interacción
  }

  res.sendStatus(200);
});

// Ruta para verificar el webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.sendStatus(403);
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
