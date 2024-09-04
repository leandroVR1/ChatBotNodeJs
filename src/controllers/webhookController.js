const messageController = require("./messageController");
const userState = require("../utils/userState");
const whatsappService = require("../services/whatsappService");
const messageCompanyController = require("./messageCompanyControllers");
const messageCoworkingController = require("./messageCoworkingControllers"); 
const messageJobController = require("./messageJobController"); 


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
      // Validar si el correo contiene un '@'
      if (!text.includes('@')) {
        await whatsappService.sendMessageFunction.sendText(from, "Correo no válido. Por favor, proporciona un correo electrónico válido.");
        await messageController.askForEmail(from);
      } else {
        await messageController.confirmData(from, text, "correo electrónico");
        userState.setUserState(from, {
          stage: "awaiting_email_confirmation",
          email: text,
        });
      }
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
      await messageController.sendInitialMenuMessage(
        from,
        "Escogiste Futuro Coder"
      );
      break;
    case "option2":
      await messageController.sendCompany(from, "Escogiste Empresa");
      break;
    case "option3":
      await messageController.sendSecondaryMenuMessage(from);
      break;
    case "option4":
      await messageController.sendInitialMenuMessage(
        from,
        "Escogiste Coworking"
      );
      break;
    case "option5":
      await messageController.sendInitialMenuMessage(
        from,
        "Escogiste Trabaja con Nosotros"
      );
      break;
    case "option6":
      await messageController.sendInitialMenuMessage(
        from,
        "Gracias por usar nuestro servicio. ¡Hasta luego!"
      );
      break;

    case "option1company":
      await messageCompanyController.companyinfo(from);
      
        await messageController.sendCompany(from, "Escogiste Empresa");
      break;
    case "option2company":
      await messageCompanyController.sendcontacto(from);
        await messageController.sendCompany(from, "Escogiste Empresa");
      break;
    case "option3company":
      await messageController.sendInitialMenuMessage(
        from)
      break;


    // Código coworking
    case "option1coworking":
      await messageCoworkingController.sendCoworkingInfo(from);
      break;
    case "option2coworking":
      await messageCoworkingController.sendContactoDayana(from);
      break;
    case "option3coworking":
      await messageCoworkingController.sendMainMenu(from);
      break;
    case "option4coworking":
      await messageCoworkingController.closeConversation(from);
      break;


    // Código trabaja con nosotros
    case "option1job":
      await messageJobController.sendMainMenu(from);
      break;
    case "option2job":
      await messageJobController.closeConversation(from);
      break;
    default:
      await messageController.sendInitialMenuMessage(
        from,
        "Opción no válida. Por favor, selecciona una opción del menú."
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



