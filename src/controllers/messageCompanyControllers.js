const { set } = require("express/lib/application");
const whatsappService = require("../services/whatsappService");
const webhookController = require("./webhookController");

async function sendWelcomeMessage(to) {
  const buttons = [
    { id: "option1company", title: "1. Servicios Riwi" },
    { id: "option2company", title: "2. Contacto" },
    { id: "option3company", title: "3. Regresar" },
  ];
  await whatsappService.sendMessageFunction.sendInteractiveMessage(
    to,
    "Selecciona una opción de nuestro apartado empresarial:",
    buttons
  );
}
async function companyinfo(to) {
  await whatsappService.sendMessageFunction.sendText(
    to,
    "Para conocer más sobre nuestros servicios, te enviaré nuestro brochure empresarial. Ahí encontrarás todos los detalles sobre cómo podemos ayudarte a potenciar tu equipo con talento Tech de primer nivel."
  );
  await whatsappService.sendMessageFunction.sendPDF(
    to,
    "https://firebasestorage.googleapis.com/v0/b/riwiprueba-54df5.appspot.com/o/Riwi_empresarial_v3_resumen.pdf?alt=media&token=d319440d-df7a-43ae-b074-f78fcec1b7e6",
    "En este documento encontraras todo lo que necesitas saber sobre nuestros servicios.",
    "Riwi Empresarial"
  );

  
    await whatsappService.sendMessageFunction.sendText(
      to,
      "Visita sitio web para más información https://riwi.io/empleadores/"
    );
    const buttons = [
        { id: "option1cases", title: "1. Celsia" },
        { id: "option2cases", title: "2. Sistecredito" },
        { id: "option3cases", title: "3. Smartfit" },
      ];
  await whatsappService.sendMessageFunction.sendInteractiveMessage(
    to,
    "Selecciona una opción de nuestros casos de éxito:",
    buttons
  );
}

async function sendCases(to, cases) {
  if (cases === "celsia") {
    await whatsappService.sendMessageFunction.sendVideo(
      to,
      "https://firebasestorage.googleapis.com/v0/b/riwiprueba-54df5.appspot.com/o/celsia.mp4?alt=media&token=2191dcbe-5815-4982-8fee-a35d3b7089be",
      "*Celsia*"
    );
  } else if (cases === "sistecredito") {
    await whatsappService.sendMessageFunction.sendVideo(
      to,
      "https://firebasestorage.googleapis.com/v0/b/riwiprueba-54df5.appspot.com/o/Sistecredito.mp4?alt=media&token=fb28f9bf-c9b6-4298-91c5-13db5b22b0a1",
      "Sistecredito"
    );
  }else if (cases === "smartfit") {
    await whatsappService.sendMessageFunction.sendVideo(
      to,
      "https://firebasestorage.googleapis.com/v0/b/riwiprueba-54df5.appspot.com/o/smartfit.mp4?alt=media&token=19d5892d-2533-409e-bb5b-354f089fe488",
      "Smartfit"
    );
}
}

async function sendcontacto(to) {
  await whatsappService.sendMessageFunction.sendText(
    to,
   "*¿Necesitas más información sobre nuestros servicios?*\nPuedes comunicarte con uno de nuestros asesores comerciales para agendar unareunión y resolver cualquier duda. Juntos, personalizaremos la soluciónperfecta para tu empresa.");
  const buttons = [
    { id: "option1contacto", title: "1. Contacto 📲" },
    { id: "option2contacto", title: "2. Finalizar 🚪" },
  ];
  await whatsappService.sendMessageFunction.sendInteractiveMessage(
    to,
    "Opciones:",
    buttons
  );
}
async function sendRiwiContacto(to) {
    await whatsappService.sendMessageFunction.sendText(to,"anexar link de contacto")
}

module.exports = {
  sendWelcomeMessage,
  companyinfo,
  sendcontacto,
  sendRiwiContacto,
  sendcontacto,
  sendRiwiContacto,sendCases
};
