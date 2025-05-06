const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Nécessite le package `dotenv`

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration DeepSeek (avec votre clé)
const DEEPSEEK_API_KEY = 'sk-ee127fe5fa2f40959d2c50749e905f87'; // À externaliser en prod!
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Endpoint /chat
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  // Validation
  if (!message || message.trim().length < 2) {
    return res.status(400).json({ 
      error: 'Message trop court (min 2 caractères)'
    });
  }

  try {
    // Appel à l'API DeepSeek
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`, // Clé utilisée ici
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    // Réponse réussie
    res.json({ 
      response: response.data.choices[0].message.content 
    });

  } catch (error) {
    // Gestion des erreurs
    console.error('Erreur DeepSeek:', error.message);
    res.status(500).json({
      error: 'Erreur de communication avec l\'IA',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur actif sur http://localhost:${port}`);
});
