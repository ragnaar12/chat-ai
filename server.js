const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configuration
const DEEPSEEK_API_KEY = 'sk-ee127fe5fa2f40959d2c50749e905f87'; // À remplacer par votre clé

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route API
app.post('/chat', async (req, res) => {
    try {
        const response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions',
            {
                model: "deepseek-chat",
                messages: [{ role: "user", content: req.body.message }],
                temperature: 0.7,
                max_tokens: 1000
            },
            {
                headers: {
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );

        res.json({
            response: response.data.choices[0].message.content,
            tokens_used: response.data.usage.total_tokens
        });

    } catch (error) {
        console.error('Erreur API DeepSeek:', error.response?.data || error.message);
        res.status(500).json({
            error: "Erreur du serveur",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Route pour servir le frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
    console.log('Mode développement - Clé API visible dans le code');
});
