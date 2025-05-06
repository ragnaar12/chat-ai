const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config(); // Pour charger les variables d'environnement depuis un fichier .env

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialisation de l'API OpenAI avec la clé API depuis les variables d'environnement
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message utilisateur manquant.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: userMessage }],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erreur OpenAI :', error);
    res.status(500).send('Erreur lors de la communication avec ChatGPT');
  }
});

app.listen(port, () => {
  console.log(`Serveur UniSign connecté à ChatGPT : http://localhost:${port}`);
});

