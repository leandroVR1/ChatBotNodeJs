const messageController = require("./messageController");
const userState = require("../utils/userState");
const whatsappService = require("../services/whatsappService");
const messageCompanyController = require("./messageCompanyControllers");
const messageFuturoCoderController = require("./messageFutureCoderController");

async function handleWebhook(req, res) {
  const { body } = req;
  if (body.object === "whatsapp_business_account") {
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        const messages = change.value.messages;
        if (messages && messages.length > 0) {
          const message = messages[0];
          const from = message.from;
          const replyId = message.interactive?.button_reply?.id;
          const text = message.text?.body;

          const userStateData = userState.getUserState(from) || {
            stage: "initial",
          };

          if (!replyId) {
            await handleTextMessage(from, text, userStateData);
          } else {
            await handleReplyMessage(from, replyId, userStateData);
          }
        }
      }
    }
  }
  res.sendStatus(200);
}

async function handleTextMessage(from, text, userStateData) {
  switch (userStateData.stage) {
    case "initial":
      await messageController.sendWelcomeMessage(from);
      setTimeout(async () => {
        await messageController.sendTermsAndConditions(from);
      }, 1000);
      userState.setUserState(from, { stage: "awaiting_terms" });
      break;
    case "awaiting_name":
      await messageController.confirmData(from, text, "nombre");
      userState.setUserState(from, {
        stage: "awaiting_name_confirmation",
        name: text,
      });
      break;
    case "awaiting_email":
      await messageController.confirmData(from, text, "correo electrónico");
      userState.setUserState(from, {
        stage: "awaiting_email_confirmation",
        email: text,
      });
      break;
  }
}

async function handleReplyMessage(from, replyId, userStateData) {
  switch (replyId) {
    case "accept_terms":
      await messageController.askForName(from);
      userState.setUserState(from, { stage: "awaiting_name" });
      break;
    case "decline_terms":
      await whatsappService.sendMessageFunction.sendText(
        from,
        "Lo sentimos, debes aceptar los términos para continuar. ¡Hasta luego!"
      );
      userState.clearUserState(from);
      break;
    case "confirm_nombre":
      await messageController.askForEmail(from);
      userState.setUserState(from, { stage: "awaiting_email" });
      break;
    case "retry_nombre":
      await messageController.askForName(from);
      userState.setUserState(from, { stage: "awaiting_name" });
      break;
    case "confirm_correo electrónico":
      await messageController.sendInitialMenuMessage(from);
      userState.clearUserState(from);
      break;
    case "retry_correo electrónico":
      await messageController.askForEmail(from);
      userState.setUserState(from, { stage: "awaiting_email" });
      break;
    case "option1":
      await messageFuturoCoderController.sendWelcomeMessage(from);
      break;
    case "option2":
      await messageController.sendCompany(from, "Escogiste Empresa");
      break;
    case "option3":
      await messageController.sendSecondaryMenuMessage(from);
      break;
    case "option1coder":
      await messageFuturoCoderController.coderInfo(from);
      await messageFuturoCoderController.sendWelcomeMessage(from);  // Redirige al menú de Futuro Coder
      break;
    case "option2coder":
      await messageFuturoCoderController.coderRegistration(from);
      await messageFuturoCoderController.sendWelcomeMessage(from);  // Redirige al menú de Futuro Coder
      break;
    case "option3coder":
      await messageFuturoCoderController.sendMoreOptionsMessage(from);
      break;
    case "option4coder":
      await messageFuturoCoderController.coderAdvisor(from); // Implementa esta función en tu controlador
      await messageFuturoCoderController.sendWelcomeMessage(from);  // Redirige al menú de Futuro Coder
      break;
    case "option5coder":
      await messageController.sendInitialMenuMessage(from);
      break;
    case "option6coder":
      await whatsappService.sendMessageFunction.sendText(
        from,
        "Gracias por usar nuestro servicio. ¡Hasta luego! 👋"
      );
      userState.clearUserState(from);
      break;
    default:
      await whatsappService.sendMessageFunction.sendText(
        from,
        "Lo siento, no entiendo esa opción."
      );
      break;
  }
}



function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.sendStatus(403);
  }
}

module.exports = {
  handleWebhook,
  verifyWebhook,
};
