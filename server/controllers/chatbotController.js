const chatbotService = require('../services/chatbotService');

exports.handleChatbotRequest = async (req, res) => {
    const {question, useAI} = req.body;
    try {
        const response = await chatbotService.processQuestion(question, useAI);
        res.json(response);
    } catch (error) {
        console.error('Chatbot Error:', error);
        res.status(500).json({
            error: 'An error occurred while processing your request.',
            message: error.message
        });
    }
};