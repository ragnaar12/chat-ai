const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuration CORS sécurisée
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500' // Adaptez à l'URL de votre front
}));

app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Endpoint optimisé
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message requis' });
  }

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 8000
      }
    );

    res.json({
      response: response.data.choices[0].message.content,
      tokens: response.data.usage.total_tokens
    });

  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      error: error.response?.data?.error?.message || 'Erreur serveur'
    });
  }
});

app.listen(port, () => {
  console.log(`Serveur DeepSeek actif sur http://localhost:${port}`);
});



