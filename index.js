require('dotenv').config();  // Cargar variables de entorno desde .env
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const { GRAPH_API_TOKEN, BUSINESS_PHONE_NUMBER_ID, WEBHOOK_VERIFY_TOKEN } = process.env;

// Ruta para enviar un mensaje
app.post("/send-message", async (req, res) => {
  const { to, message } = req.body;

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

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error sending message:", error.response ? error.response.data : error.message);
    res.status(500).send("Error sending message.");
  }
});

// Ruta para manejar los mensajes entrantes
app.post("/webhook", (req, res) => {
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);  // Acknowledge receipt of the webhook event
});

// Ruta para verificar el webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.sendStatus(403);
  }
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here. Checkout README.md to start.</pre>`);
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
