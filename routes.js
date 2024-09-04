const express = require("express");
const webhookController = require("./src/controllers/webhookController");
const router = express.Router();

// Rutas
router.post("/webhook", webhookController.handleWebhook);
router.get("/webhook", webhookController.verifyWebhook);

module.exports = router;
