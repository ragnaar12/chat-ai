const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Pour gérer les variables d'environnement

const app = express();
const port = process.env.PORT || 3000;

// Configuration sécurisée
app.use(cors({
  origin: ['http://localhost:3000', 'https://votre-domaine.com'] // Limitez les origines autorisées
}));
app.use(express.json());

// Charge la clé depuis les variables d'environnement (fichier .env)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-ee127fe5fa2f40959d2c50749e905f87';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Middleware de vérification d'API Key (optionnel)
const checkApiKey = (req, res, next) => {
  const clientApiKey = req.headers['x-api-key'];
  if (!clientApiKey || clientApiKey !== 'UN_SECRET_POUR_FRONTEND') {
    return res.status(403).json({ error: 'Accès non autorisé' });
  }
  next();
};

app.post('/chat', checkApiKey, async (req, res) => {
  const { message, temperature = 0.7 } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message requis' });
  }

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: message }],
        temperature: Math.min(Math.max(parseFloat(temperature), 0.1), 1.0), // Borné entre 0.1 et 1.0
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 secondes max
      }
    );

    res.json({ 
      response: response.data.choices[0].message.content,
      usage: response.data.usage // Ajoute les stats d'utilisation
    });

  } catch (error) {
    console.error('Erreur DeepSeek:', error.code, error.message);

    // Gestion fine des erreurs
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error?.message || 'Erreur serveur';

    res.status(statusCode).json({ 
      error: errorMessage,
      details: statusCode === 500 ? undefined : error.response?.data 
    });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur DeepSeek actif sur http://localhost:${port}`);
  if (!process.env.DEEPSEEK_API_KEY) {
    console.warn('⚠️  Avertissement : Clé API en dur détectée (à remplacer par une variable d\'environnement)');
  }
});



