const messageController = require("./messageController");
const userState = require("../utils/userState");
const whatsappService = require("../services/whatsappService");
const messageCompanyController = require("./messageCompanyControllers");
const messageCoworkingController = require("./messageCoworkingControllers");
const messageJobController = require("../controllers/messageJobControllers");
const messageFuturoCoderController = require("./messageFutureCoderController");
const { set } = require("express/lib/application");

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
            lastactive: Date.now(),
            inactivityMessageSent: false,
          };

          if (!replyId) {
            await handleTextMessage(from, text, userStateData);
          } else {
            await handleReplyMessage(from, replyId, userStateData);
          }
          // await clearInactivityTimer(from,userStateData)
        }
      }
    }
  }
  res.sendStatus(200);
}

async function handleTextMessage(from, text, userStateData) {
 
  console.log(userStateData.timeOutId);

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
      if (!text.includes("@")) {
        await whatsappService.sendMessageFunction.sendText(
          from,
          "Correo no válido. Por favor, proporciona un correo electrónico válido."
        );
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
      await messageFuturoCoderController.sendWelcomeMessage(from);
      
      break;
    case "option2":
      await messageCompanyController.sendWelcomeMessage(from);
      
      break;
    case "option3":
      await messageController.sendSecondaryMenuMessage(from);
      
      break;
    case "option4":
      await messageCoworkingController.sendWelcomeMessage(from);
      
      break;
    case "option1coder":
      await messageFuturoCoderController.coderInfo(from);
      setTimeout(async () => {
        await messageFuturoCoderController.sendMenu2(from);
      },5000);
      
      
      break;
    case "option5":
      await messageJobController.sendJobInfo(from);
      
      break;
    case "option2coder":
      await messageFuturoCoderController.coderRegistration(from);
      setTimeout(async () => {
        await messageFuturoCoderController.sendMenu2(from);
      }, 3000);
      break;
    case "option6":
      await messageController.sendBye(from);
      
      userState.clearUserState(from);
      break;
    case "option3coder":
      await messageFuturoCoderController.sendMoreOptionsMessage(from);
      
      break;
    case "option1company":
      await messageCompanyController.companyinfo(from);
      setTimeout(async () => {
        await messageCompanyController.sendWelcomeMessage(from);
      }, 3000);
      
      break;
    case "option4coder":
      await messageFuturoCoderController.coderAdvisor(from);
      setTimeout(async () => {
        await messageFuturoCoderController.sendMenu2(from);
      }, 3000);
      
      break;
    case "option2company":
      setTimeout(async () => {
        await messageCompanyController.sendcontacto(from);
      }, 2000);
      
      
      break;
    case "option5coder":
      await messageFuturoCoderController.sendReturnMessage(from);
      setTimeout(async () => {
        await messageController.sendInitialMenuMessage(from);
      }, 3000);
      
      break;
    case "option3company":
      await messageController.sendInitialMenuMessage(from);
      
      break;
    case "option1contacto":
      await messageCompanyController.sendRiwiContacto(from);
      setTimeout(async () => {
        await messageController.sendBye(from);
      },2000);
      
      
      break;
    case "option2contacto":
      await messageController.sendInitialMenuMessage(from);
      
      break;
    case "option1coworking":
      await messageCoworkingController.sendCoworkingInfo(from);
      setTimeout(async () => {
        await messageCoworkingController.sendWelcomeMessage(from);
      }, 2000);
      
      
      
      break;
    case "option2coworking":
      await messageCoworkingController.sendContactoDayana(from);
      setTimeout(async () => {
        await messageCoworkingController.sendWelcomeMessage(from);
      }, 2000);
      
      
      break;
    case "option3coworking":
      await messageController.sendBye(from);
      
      break;
    case "option1job":
      await messageController.sendInitialMenuMessage(from);
      
      break;
    case "option2job":
      await messageController.sendBye(from);
      
      break;
    case "option6coder":
      await messageFuturoCoderController.sendFinishMessage(from);
      
      userState.clearUserState(from);
      break;
    case "opcion1In":
      await messageController.sendInitialMenuMessage(from);
      
      
      break;
    case "opcion2Out":
      await messageController.sendBye(from);
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
// async function resetInactivityTimer(from, userStateData) {

//   userState.setUserState(from, {
//     ...userStateData,
//     lastactive: Date.now(),
//     inactivityMessageSent: false,
//   });

 
//   if (userStateData.timeOutId) {
//     clearTimeout(userStateData.timeOutId);
//   }


//   const timeOutId = setTimeout(async () => {
//     try {
//       const updatedUserState = userState.getUserState(from);

     
//       if (!updatedUserState.inactivityMessageSent) {
        
//         await messageController.sendMessageTime(from);
//         await messageController.sendMessageTimeOutButton(from);
//         userState.setUserState(from, {
//           ...updatedUserState,
//           inactivityMessageSent: true,
//         });
//       }
//     } catch (error) {
//       console.error("Error sending inactivity message:", error);
//     }
//   }, 60000)

  
//   userState.setUserState(from, {
//     ...userStateData,
//     timeOutId: timeOutId,
//   });
// }



// async function clearInactivityTimer(from, userStateData) {
//   console.log('User State Data:', userStateData);

//   if (userStateData.timeOutId) {
//     console.log(`Clearing timeout for user: ${from}`);
//     clearTimeout(userStateData.timeOutId);
//   }


//   userState.setUserState(from, {
//     ...userStateData,
//     inactivityMessageSent: false,
//     timeOutId: null, 
//   });
// }

module.exports = {
  handleWebhook,
  verifyWebhook,
};
