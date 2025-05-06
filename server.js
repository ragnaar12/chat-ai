const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: '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', // Remplace par ta clé API OpenAI
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: userMessage }],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la communication avec ChatGPT');
  }
});

app.listen(port, () => {
  console.log(`Serveur UniSign connecté à ChatGPT : http://localhost:${port}`);
});
