
// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ⚠️ Clé API en dur (à utiliser uniquement pour des tests)
const DEEPSEEK_API_KEY = 'sk-ee127fe5fa2f40959d2c50749e905f87';

// Endpoint de chat
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message requis' });
  }

  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: message }],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    res.json({ response: response.data.choices[0].message.content });

  } catch (error) {
    console.error('Erreur:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Erreur du serveur',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.listen(port, () => {
  console.log(`Serveur actif sur http://localhost:${port}`);
  console.warn('⚠️ Mode non sécurisé : Clé API visible dans le code');
});
