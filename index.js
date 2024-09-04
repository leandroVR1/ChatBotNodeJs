require('dotenv').config();
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const { GRAPH_API_TOKEN, BUSINESS_PHONE_NUMBER_ID } = process.env;

// Objeto para mantener el estado del usuario (en memoria)
const userStates = {};

async function sendMessage(message) {
  console.log("Enviando mensaje:", message); // Mensaje de depuración
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

async function sendWelcomeMessage(to) {
  const welcomeMessage = {
    messaging_product: "whatsapp",
    to: to,
    type: "image",
    image: {
      link: "https://www.estamosenlinea.co/wp-content/uploads/2023/11/riwi.jpg",
      caption: "👋 ¡Hola! Para comenzar, debes aceptar los términos y condiciones.",
    },
  };

  await sendMessage(welcomeMessage);
}

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
              title: "Sí ✅",
            },
          },
          {
            type: "reply",
            reply: {
              id: "decline_terms",
              title: "No ❌",
            },
          },
        ],
      },
    },
  };

  await sendMessage(termsMessage);
}

async function askForName(to) {
  const nameRequestMessage = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: {
      body: "😊 Por favor, dime tu nombre.",
    },
  };

  await sendMessage(nameRequestMessage);
}

async function askForEmail(to) {
  const emailRequestMessage = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: {
      body: "📧 Ahora, por favor, dime tu correo electrónico.",
    },
  };

  await sendMessage(emailRequestMessage);
}

async function confirmData(to, data, type) {
  const confirmationMessage = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: `¿Es este tu ${type}? ${data}`,
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: `confirm_${type}`,
              title: "Sí ✅",
            },
          },
          {
            type: "reply",
            reply: {
              id: `retry_${type}`,
              title: "No ❌",
            },
          },
        ],
      },
    },
  };

  await sendMessage(confirmationMessage);
}

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
              title: "1. Futuro Coder 💻",
            },
          },
          {
            type: "reply",
            reply: {
              id: "option2",
              title: "2. Empresa 🏢",
            },
          },
          {
            type: "reply",
            reply: {
              id: "option3",
              title: "3. Más opciones 🔽",
            },
          },
        ],
      },
    },
  };

  await sendMessage(menuMessage);
}

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
              title: "4. Coworking 🏠",
            },
          },
          {
            type: "reply",
            reply: {
              id: "option5",
              title: "5. Trabaja con Nosotros 🤝",
            },
          },
          {
            type: "reply",
            reply: {
              id: "option6",
              title: "6. Cerrar 🚪",
            },
          },
        ],
      },
    },
  };

  await sendMessage(menuMessage);
}

async function sendFuturoCoderMenuMessage(to) {
  const menuMessage = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "Futuro Coder 💻:",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "coder_info",
              title: "1. En qué consiste",
            },
          },
          {
            type: "reply",
            reply: {
              id: "coder_registration",
              title: "2. Inscripción",
            },
          },
          {
            type: "reply",
            reply: {
              id: "coder_more_options",
              title: "3. Más opciones 🔽",
            },
          },
        ],
      },
    },
  };
  await sendMessage(menuMessage);
}

async function sendFuturoCoderMoreOptionsMessage(to) {
  const menuMessage = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "Más opciones Futuro Coder:",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "coder_advisor",
              title: "4. Hablar con Asesor",
            },
          },
          {
            type: "reply",
            reply: {
              id: "coder_return",
              title: "5. Regresar al menú",
            },
          },
          {
            type: "reply",
            reply: {
              id: "coder_end",
              title: "6. Finalizar 🚪",
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
          const text = message.text?.body;

          // Verificar el estado del usuario
          const userState = userStates[from] || { stage: "initial" };

          if (!replyId) {
            if (userState.stage === "initial") {
              // Enviar mensaje de bienvenida
              await sendWelcomeMessage(from);
              
              // Esperar un momento antes de enviar los términos y condiciones
              setTimeout(async () => {
                await sendTermsAndConditions(from);
              }, 1000);
              userStates[from] = { stage: "awaiting_terms" };
            } else if (userState.stage === "awaiting_name") {
              // Confirmar nombre
              await confirmData(from, text, "nombre");
              userStates[from] = { stage: "awaiting_name_confirmation", name: text };
            } else if (userState.stage === "awaiting_email") {
              // Confirmar correo electrónico
              await confirmData(from, text, "correo electrónico");
              userStates[from] = { stage: "awaiting_email_confirmation", email: text };
            }
          } else {
            // Manejo de respuestas del usuario
            switch (replyId) {
              case "accept_terms":
                await sendMessage({
                  messaging_product: "whatsapp",
                  to: from,
                  type: "text",
                  text: {
                    body: "¡Gracias por aceptar! Por favor, dime tu nombre.",
                  },
                });
                userStates[from] = { stage: "awaiting_name" };
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
                delete userStates[from]; // Limpiar estado
                break;
              case "confirm_nombre":
                await sendMessage({
                  messaging_product: "whatsapp",
                  to: from,
                  type: "text",
                  text: {
                    body: "¡Perfecto! Ahora, por favor, dime tu correo electrónico.",
                  },
                });
                userStates[from] = { stage: "awaiting_email" };
                break;
              case "retry_nombre":
                await sendMessage({
                  messaging_product: "whatsapp",
                  to: from,
                  type: "text",
                  text: {
                    body: "Por favor, vuelve a decirme tu nombre.",
                  },
                });
                userStates[from].stage = "awaiting_name"; // Asegurar que el estado sea correcto
                break;
              case "confirm_correo electrónico":
                await sendInitialMenuMessage(from);
                delete userStates[from]; // Limpiar estado
                break;
              case "retry_correo electrónico":
                await sendMessage({
                  messaging_product: "whatsapp",
                  to: from,
                  type: "text",
                  text: {
                    body: "Por favor, vuelve a decirme tu correo electrónico.",
                  },
                });
                userStates[from].stage = "awaiting_email"; // Asegurar que el estado sea correcto
                break;
                case "option1":
                  await sendFuturoCoderMenuMessage(from);
                  userStates[from] = { stage: "futuro_coder" };
                  break;
                case "option2":
                  await sendMessage({
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: {
                      body: "Escogiste Empresa 🏢",
                    },
                  });
                  // Agrega lógica para el submenú de Empresa aquí
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
                      body: "Escogiste Coworking 🏠",
                    },
                  });
                  // Agrega lógica para el submenú de Coworking aquí
                  break;
                case "option5":
                  await sendMessage({
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: {
                      body: "Escogiste Trabaja con Nosotros 🤝",
                    },
                  });
                  // Agrega lógica para el submenú de Trabaja con Nosotros aquí
                  break;
                case "option6":
                  await sendMessage({
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: {
                      body: "Gracias por usar nuestro servicio. ¡Hasta luego! 👋",
                    },
                  });
                  delete userStates[from]; // Limpiar estado
                  break;
                case "coder_info":
                  await sendMessage({
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: {
                      body: "Aquí te explicamos en qué consiste ser un Coder...",
                    },
                  });
                  break;
                case "coder_registration":
                  await sendMessage({
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: {
                      body: "Aquí está el proceso de inscripción...",
                    },
                  });
                  break;
                case "coder_more_options":
                  await sendFuturoCoderMoreOptionsMessage(from);
                  break;
                case "coder_advisor":
                  await sendMessage({
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: {
                      body: "Puedes hablar con un asesor aquí...",
                    },
                  });
                  break;
                case "coder_return":
                  await sendMessage({
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: {
                      body: "Regresando al menú principal...",
                    },
                  });
                  await sendInitialMenuMessage(from); // Regresar al menú inicial
                  break;
                case "coder_end":
                  await sendMessage({
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: {
                      body: "Gracias por usar nuestro servicio. ¡Hasta luego! 👋",
                    },
                  });
                  delete userStates[from]; // Limpiar estado
                  break;
                default:
                  await sendMessage({
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: {
                      body: "Lo siento, no entiendo esa opción.",
                    },
                  });
                  break;
              }
            }
          }
        });
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

// Webhook para la verificación de Meta
app.get("/webhook", (req, res) => {
  const verify_token = process.env.WEBHOOK_VERIFY_TOKEN; 

  // Parse params from the request
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});


app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
