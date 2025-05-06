const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialisation de l'API OpenAI avec la clé API intégrée
const openai = new OpenAI({
  apiKey: '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',  // Remplacer par ta clé API
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message utilisateur manquant.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erreur lors de la communication avec OpenAI:', error);

    if (error.response) {
      console.error('Détails de l\'erreur :', error.response.data);
      res.status(500).json({ error: 'Erreur de connexion à l\'API OpenAI.', details: error.response.data });
    } else {
      res.status(500).json({ error: 'Erreur de serveur interne lors de la communication avec ChatGPT.' });
    }
  }
});

app.listen(port, () => {
  console.log(`Serveur UniSign connecté à ChatGPT : http://localhost:${port}`);
});



