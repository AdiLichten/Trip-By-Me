const xlsx = require('xlsx');
const path = require('path');
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-pro';

const readFAQsFromExcel = () => {
    const filePath = path.join(__dirname, '../Chatbot_questions.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    return data.map(row => ({
        pattern: row.pattern,
        answer: row.answer
    }));
};

const getGeminiResponse = async (question) => {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured');
    }

    try {
        const prompt = `You are a travel agent. Answer the following question as a travel agent: ${question}`;
        const response = await axios({
            method: 'post',
            url: `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            }
        });

        if (response.data.candidates && response.data.candidates[0]?.content?.parts[0]?.text) {
            return response.data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error('Unexpected response format from Gemini API');
        }
    } catch (error) {
        if (error.response) {
            console.error('Gemini API Error Details:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        }
        throw new Error(`Failed to get AI response: ${error.message}`);
    }
};

exports.processQuestion = async (question, useAI = false) => {
    try {
        if (useAI) {
            const aiResponse = await getGeminiResponse(question);
            return {answer: aiResponse};
        }

        const faqs = readFAQsFromExcel();
        const input = question.toLowerCase();
        const matchingFaqs = faqs.filter(faq =>
            faq.pattern.toLowerCase().includes(input) ||
            input.includes(faq.pattern.toLowerCase())
        );

        if (matchingFaqs.length === 0) {
            return {
                noMatch: true,
                answer: null
            };
        }

        const bestMatch = matchingFaqs.sort((a, b) => b.pattern.length - a.pattern.length)[0];
        return {answer: bestMatch.answer};
    } catch (error) {
        console.error('Error processing question:', error);
        throw error;
    }
};