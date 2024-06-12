import { GoogleGenerativeAI } from "@google/generative-ai";
        const API_KEY = 'AIzaSyDxV-US7bb_Q2Jbo1V69P9gzbSvp-SzDHM';
        const genAI = new GoogleGenerativeAI(API_KEY);

        async function run() {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = document.getElementById('prompt').value;

            if (prompt.trim() === "") return;

            // Display user's message
            const chatBody = document.getElementById('chat-body');
            const userMessage = document.createElement('div');
            userMessage.className = 'chat-message user';
            userMessage.textContent = prompt;
            chatBody.appendChild(userMessage);
            chatBody.scrollTop = chatBody.scrollHeight;

            // Clear the input
            document.getElementById('prompt').value = '';

            // Custom response logic
            const customResponse = getCustomResponse(prompt);
            if (customResponse) {
                displayBotMessage(customResponse);
            } else {
                try {
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const text = await response.text();
                    displayBotMessage(text);
                } catch (error) {
                    console.error('Error generating response:', error);
                }
            }
        }

        function getCustomResponse(prompt) {
            const responses = {
                "hello": "Hi there! How can I help you today?",
                "how are you": "I'm just a bot, but I'm doing great! How about you?",
                "who is your devloper": "My devloper is Santosh Parajuli but he developed me by integrating gemini ai which is powered by Google.",
                "what is your name": "I'm Jenis here to assist you with your questions."
            };
            const cleanedPrompt = normalizeInput(prompt);
            return responses[cleanedPrompt] || null;
        }

        function normalizeInput(input) {
            return input
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function displayBotMessage(message) {
            const chatBody = document.getElementById('chat-body');
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot';
            chatBody.appendChild(botMessage);
            chatBody.scrollTop = chatBody.scrollHeight;

            let index = 0;

            function typeMessage() {
                if (index < message.length) {
                    botMessage.textContent += message[index];
                    index++;
                    chatBody.scrollTop = chatBody.scrollHeight;
                    setTimeout(typeMessage, 30); // Adjust typing speed here
                }
            }

            typeMessage();
        }

        document.getElementById('gen-btn').addEventListener('click', run);
        document.getElementById('prompt').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') run();
        });
