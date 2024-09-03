require('dotenv').config();
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const { GRAPH_API_TOKEN, BUSINESS_PHONE_NUMBER_ID } = process.env;

// Función para enviar mensajes
async function sendMessage(message) {
  await axios.post(
    `https://graph.facebook.com/v20.0/${BUSINESS_PHONE_NUMBER_ID}/messages`,
    message,
    {
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

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

// Enviar mensaje de bienvenida con imagen
async function sendWelcomeMessage(to) {
  const welcomeMessage = {
    messaging_product: "whatsapp",
    to: to,
    type: "image",
    image: {
      link: "https://www.estamosenlinea.co/wp-content/uploads/2023/11/riwi.jpg", // Enlace a la imagen
      caption:
        "¡Hola! Para comenzar, debes aceptar los términos y condiciones.",
    },
  };

  await sendMessage(welcomeMessage);
}

// Enviar botones de aceptación de términos y condiciones
async function sendTermsAndConditions(to) {
  const termsMessage = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "¿Aceptas los términos y condiciones?",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "accept_terms",
              title: "Sí",
            },
          },
          {
            type: "reply",
            reply: {
              id: "decline_terms",
              title: "No",
            },
          },
        ],
      },
    },
  };

  await sendMessage(termsMessage);
}

//Pedir nombre al usuario



// Enviar primer menú de opciones
async function sendInitialMenuMessage(to) {
  const menuMessage = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "Selecciona una opción:",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "option1",
              title: "1. Futuro Coder",
            },
          },
          {
            type: "reply",
            reply: {
              id: "option2",
              title: "2. Empresa",
            },
          },
          {
            type: "reply",
            reply: {
              id: "option3",
              title: "3. Más opciones",
            },
          },
        ],
      },
    },
  };

  await sendMessage(menuMessage);
}

// Enviar segundo menú de opciones
async function sendSecondaryMenuMessage(to) {
  const menuMessage = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "Selecciona una opción:",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "option4",
              title: "4. Coworking",
            },
          },
          {
            type: "reply",
            reply: {
              id: "option5",
              title: "5. Trabaja con",
            },
          },
          {
            type: "reply",
            reply: {
              id: "option6",
              title: "6. Cerrar",
            },
          },
        ],
      },
    },
  };

  await sendMessage(menuMessage);
}

// Webhook para recibir mensajes y enviar respuestas
app.post("/webhook", async (req, res) => {
  const { body } = req;
  if (body.object === "whatsapp_business_account") {
    body.entry.forEach((entry) => {
      entry.changes.forEach(async (change) => {
        const messages = change.value.messages;
        if (messages && messages.length > 0) {
          const message = messages[0];
          const from = message.from;
          const replyId = message.interactive?.button_reply?.id;

          if (!replyId) {
            // Enviar mensaje de bienvenida
            await sendWelcomeMessage(from);
            
            // Esperar un momento antes de enviar los términos y condiciones
            setTimeout(async () => {
              await sendTermsAndConditions(from);
            }, 1000); // 1000ms = 1 segundo de espera
          } else {
            // Manejo de opciones del menú
            switch (replyId) {
              case "accept_terms":
                await sendMessage({
                  messaging_product: "whatsapp",
                  to: from,
                  type: "text",
                  text: {
                    body: "¡Gracias por aceptar! Aquí están tus opciones:",
                  },
                });
                await sendInitialMenuMessage(from);
                break;
              case "decline_terms":
                await sendMessage({
                  messaging_product: "whatsapp",
                  to: from,
                  type: "text",
                  text: {
                    body: "Lo sentimos, debes aceptar los términos para continuar. ¡Hasta luego!",
                  },
                });
                break;
              case "option1":
                await sendMessage({
                  messaging_product: "whatsapp",
                  to: from,
                  type: "text",
                  text: {
                    body: "Escogiste Futuro Coder",
                  },
                });
                break;
              case "option2":
                await sendMessage({
                  messaging_product: "whatsapp",
                  to: from,
                  type: "text",
                  text: {
                    body: "Escogiste Empresa",
                  },
                });
                break;
              case "option3":
                await sendSecondaryMenuMessage(from);
                break;
              case "option4":
                await sendMessage({
                  messaging_product: "whatsapp",
                  to: from,
                  type: "text",
                  text: {
                    body: "Escogiste Coworking",
                  },
                });
                break;
              case "option5":
                await sendMessage({
                  messaging_product: "whatsapp",
                  to: from,
                  type: "text",
                  text: {
                    body: "Escogiste Trabaja con Nosotros",
                  },
                });
                break;
              case "option6":
                await sendMessage({
                  messaging_product: "whatsapp",
                  to: from,
                  type: "text",
                  text: {
                    body: "Gracias por usar nuestro servicio. ¡Hasta luego!",
                  },
                });
                break;
              default:
                await sendMessage({
                  messaging_product: "whatsapp",
                  to: from,
                  type: "text",
                  text: {
                    body: "Opción no válida. Por favor, selecciona una opción del menú.",
                  },
                });
                break;
            }
          }
        }
      });
    });
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
