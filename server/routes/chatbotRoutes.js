const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

router.post('/chatbot', chatbotController.handleChatbotRequest);

module.exports = router;