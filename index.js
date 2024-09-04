// require('dotenv').config();
// const express = require("express");
// const axios = require("axios");
// const app = express();
// app.use(express.json());

// const PORT = process.env.PORT || 3000;
// const { GRAPH_API_TOKEN, BUSINESS_PHONE_NUMBER_ID } = process.env;

// // Objeto para mantener el estado del usuario (en memoria)
// const userStates = {};

// async function sendMessage(message) {
//   console.log("Enviando mensaje:", message); // Mensaje de depuración
//   await axios.post(
//     `https://graph.facebook.com/v20.0/${BUSINESS_PHONE_NUMBER_ID}/messages`,
//     message,
//     {
//       headers: {
//         Authorization: `Bearer ${GRAPH_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
// }

// async function sendWelcomeMessage(to) {
//   const welcomeMessage = {
//     messaging_product: "whatsapp",
//     to: to,
//     type: "image",
//     image: {
//       link: "https://www.estamosenlinea.co/wp-content/uploads/2023/11/riwi.jpg",
//       caption: "¡Hola! Para comenzar, debes aceptar los términos y condiciones.",
//     },
//   };

//   await sendMessage(welcomeMessage);
// }

// async function sendTermsAndConditions(to) {
//   const termsMessage = {
//     messaging_product: "whatsapp",
//     to: to,
//     type: "interactive",
//     interactive: {
//       type: "button",
//       body: {
//         text: "¿Aceptas los términos y condiciones?",
//       },
//       action: {
//         buttons: [
//           {
//             type: "reply",
//             reply: {
//               id: "accept_terms",
//               title: "Sí",
//             },
//           },
//           {
//             type: "reply",
//             reply: {
//               id: "decline_terms",
//               title: "No",
//             },
//           },
//         ],
//       },
//     },
//   };

//   await sendMessage(termsMessage);
// }

// async function askForName(to) {
//   const nameRequestMessage = {
//     messaging_product: "whatsapp",
//     to: to,
//     type: "text",
//     text: {
//       body: "Por favor, dime tu nombre.",
//     },
//   };

//   await sendMessage(nameRequestMessage);
// }

// async function askForEmail(to) {
//   const emailRequestMessage = {
//     messaging_product: "whatsapp",
//     to: to,
//     type: "text",
//     text: {
//       body: "Ahora, por favor, dime tu correo electrónico.",
//     },
//   };

//   await sendMessage(emailRequestMessage);
// }

// async function confirmData(to, data, type) {
//   const confirmationMessage = {
//     messaging_product: "whatsapp",
//     to: to,
//     type: "interactive",
//     interactive: {
//       type: "button",
//       body: {
//         text: `¿Es este tu ${type}? ${data}`,
//       },
//       action: {
//         buttons: [
//           {
//             type: "reply",
//             reply: {
//               id: `confirm_${type}`,
//               title: "Sí",
//             },
//           },
//           {
//             type: "reply",
//             reply: {
//               id: `retry_${type}`,
//               title: "No",
//             },
//           },
//         ],
//       },
//     },
//   };

//   await sendMessage(confirmationMessage);
// }

// async function sendInitialMenuMessage(to) {
//   const menuMessage = {
//     messaging_product: "whatsapp",
//     to: to,
//     type: "interactive",
//     interactive: {
//       type: "button",
//       body: {
//         text: "Selecciona una opción:",
//       },
//       action: {
//         buttons: [
//           {
//             type: "reply",
//             reply: {
//               id: "option1",
//               title: "1. Futuro Coder",
//             },
//           },
//           {
//             type: "reply",
//             reply: {
//               id: "option2",
//               title: "2. Empresa",
//             },
//           },
//           {
//             type: "reply",
//             reply: {
//               id: "option3",
//               title: "3. Más opciones",
//             },
//           },
//         ],
//       },
//     },
//   };

//   await sendMessage(menuMessage);
// }

// async function sendSecondaryMenuMessage(to) {
//   const menuMessage = {
//     messaging_product: "whatsapp",
//     to: to,
//     type: "interactive",
//     interactive: {
//       type: "button",
//       body: {
//         text: "Selecciona una opción:",
//       },
//       action: {
//         buttons: [
//           {
//             type: "reply",
//             reply: {
//               id: "option4",
//               title: "4. Coworking",
//             },
//           },
//           {
//             type: "reply",
//             reply: {
//               id: "option5",
//               title: "5. Trabaja con",
//             },
//           },
//           {
//             type: "reply",
//             reply: {
//               id: "option6",
//               title: "6. Cerrar",
//             },
//           },
//         ],
//       },
//     },
//   };

//   await sendMessage(menuMessage);
// }

// // Webhook para recibir mensajes y enviar respuestas
// app.post("/webhook", async (req, res) => {
//   const { body } = req;
//   if (body.object === "whatsapp_business_account") {
//     body.entry.forEach((entry) => {
//       entry.changes.forEach(async (change) => {
//         const messages = change.value.messages;
//         if (messages && messages.length > 0) {
//           const message = messages[0];
//           const from = message.from;
//           const replyId = message.interactive?.button_reply?.id;
//           const text = message.text?.body;

//           // Verificar el estado del usuario
//           const userState = userStates[from] || { stage: "initial" };

//           if (!replyId) {
//             if (userState.stage === "initial") {
//               // Enviar mensaje de bienvenida
//               await sendWelcomeMessage(from);
              
//               // Esperar un momento antes de enviar los términos y condiciones
//               setTimeout(async () => {
//                 await sendTermsAndConditions(from);
//               }, 1000);
//               userStates[from] = { stage: "awaiting_terms" };
//             } else if (userState.stage === "awaiting_name") {
//               // Confirmar nombre
//               await confirmData(from, text, "nombre");
//               userStates[from] = { stage: "awaiting_name_confirmation", name: text };
//             } else if (userState.stage === "awaiting_email") {
//               // Confirmar correo electrónico
//               await confirmData(from, text, "correo electrónico");
//               userStates[from] = { stage: "awaiting_email_confirmation", email: text };
//             }
//           } else {
//             // Manejo de respuestas del usuario
//             switch (replyId) {
//               case "accept_terms":
//                 await sendMessage({
//                   messaging_product: "whatsapp",
//                   to: from,
//                   type: "text",
//                   text: {
//                     body: "¡Gracias por aceptar! Por favor, dime tu nombre.",
//                   },
//                 });
//                 userStates[from] = { stage: "awaiting_name" };
//                 break;
//               case "decline_terms":
//                 await sendMessage({
//                   messaging_product: "whatsapp",
//                   to: from,
//                   type: "text",
//                   text: {
//                     body: "Lo sentimos, debes aceptar los términos para continuar. ¡Hasta luego!",
//                   },
//                 });
//                 delete userStates[from]; // Limpiar estado
//                 break;
//               case "confirm_nombre":
//                 await sendMessage({
//                   messaging_product: "whatsapp",
//                   to: from,
//                   type: "text",
//                   text: {
//                     body: "¡Perfecto! Ahora, por favor, dime tu correo electrónico.",
//                   },
//                 });
//                 userStates[from] = { stage: "awaiting_email" };
//                 break;
//               case "retry_nombre":
//                 await sendMessage({
//                   messaging_product: "whatsapp",
//                   to: from,
//                   type: "text",
//                   text: {
//                     body: "Por favor, vuelve a decirme tu nombre.",
//                   },
//                 });
//                 userStates[from].stage = "awaiting_name"; // Asegurar que el estado sea correcto
//                 break;
//               case "confirm_correo electrónico":
//                 await sendInitialMenuMessage(from);
//                 delete userStates[from]; // Limpiar estado
//                 break;
//               case "retry_correo electrónico":
//                 await sendMessage({
//                   messaging_product: "whatsapp",
//                   to: from,
//                   type: "text",
//                   text: {
//                     body: "Por favor, vuelve a decirme tu correo electrónico.",
//                   },
//                 });
//                 userStates[from].stage = "awaiting_email"; // Asegurar que el estado sea correcto
//                 break;
//               case "option1":
//                 await sendMessage({
//                   messaging_product: "whatsapp",
//                   to: from,
//                   type: "text",
//                   text: {
//                     body: "Escogiste Futuro Coder",
//                   },
//                 });
//                 break;
//               case "option2":
//                 await sendMessage({
//                   messaging_product: "whatsapp",
//                   to: from,
//                   type: "text",
//                   text: {
//                     body: "Escogiste Empresa",
//                   },
//                 });
//                 break;
//               case "option3":
//                 await sendSecondaryMenuMessage(from);
//                 break;
//               case "option4":
//                 await sendMessage({
//                   messaging_product: "whatsapp",
//                   to: from,
//                   type: "text",
//                   text: {
//                     body: "Escogiste Coworking",
//                   },
//                 });
//                 break;
//               case "option5":
//                 await sendMessage({
//                   messaging_product: "whatsapp",
//                   to: from,
//                   type: "text",
//                   text: {
//                     body: "Escogiste Trabaja con Nosotros",
//                   },
//                 });
//                 break;
//               case "option6":
//                 await sendMessage({
//                   messaging_product: "whatsapp",
//                   to: from,
//                   type: "text",
//                   text: {
//                     body: "Gracias por usar nuestro servicio. ¡Hasta luego!",
//                   },
//                 });
//                 break;
//               default:
//                 await sendMessage({
//                   messaging_product: "whatsapp",
//                   to: from,
//                   type: "text",
//                   text: {
//                     body: "Opción no válida. Por favor, selecciona una opción del menú.",
//                   },
//                 });
//                 break;
//             }
//           }
//         }
//       });
//     });
//   }
//   res.sendStatus(200);
// });


// // Ruta para verificar el webhook
// app.get("/webhook", (req, res) => {
//   const mode = req.query["hub.mode"];
//   const token = req.query["hub.verify_token"];
//   const challenge = req.query["hub.challenge"];

//   if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
//     res.status(200).send(challenge);
//     console.log("Webhook verified successfully!");
//   } else {
//     res.sendStatus(403);
//   }
// });

// // Inicia el servidor
// app.listen(PORT, () => {
//   console.log(`Server is listening on port: ${PORT}`);
// });
