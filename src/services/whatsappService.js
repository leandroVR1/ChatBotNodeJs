const axios = require("axios");

const { GRAPH_API_TOKEN, BUSINESS_PHONE_NUMBER_ID } = process.env;

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

async function sendText(to, body) {
  const message = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: { body },
  };
  await sendMessage(message);
}

async function sendImage(to, link, caption) {
  const message = {
    messaging_product: "whatsapp",
    to: to,
    type: "image",
    image: { link, caption },
  };
  await sendMessage(message);
}
async function sendPDF(to, link, caption,filename) {
  const message = {
    messaging_product: "whatsapp",
    to: to,
    type: "document",
    document: { 
      link, // URL del documento PDF
      caption, // Descripción opcional del PDF
      filename
    },
  };
  await sendMessage(message);
}
async function sendVideo(to, link, caption) {
  const message = {
    messaging_product: "whatsapp",
    to: to,
    type: "video",
    video: { link, caption },
  };
  await sendMessage(message);
}
async function sendInteractiveMessage(to, bodyText, buttons) {
    const message = {
      messaging_product: "whatsapp",
      to: to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: bodyText },
        action: {
          buttons: buttons.map((button) => ({
            type: "reply",
            reply: {
              id: button.id,
              title: button.title,
            },
          })),
        },
      },
    };
    await console.log(buttons.interactive?.button_reply?.id);
    
    await sendMessage(message);
  }

  const sendMessageFunction={
    sendMessage,
    sendText,
    sendImage,
    sendInteractiveMessage,
    sendPDF,sendVideo
  }
module.exports={sendMessageFunction};