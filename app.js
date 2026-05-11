const express = require('express');
const Airtable = require('airtable');
const app = express();
app.use(express.json());

const base = new Airtable({apiKey: 'patbA2oI6kDNXbez9.6a8f55dde0f6b807b2b9e2ca1fd8030a085631d5e27ac432fb64dd4b8357967c'}).base('appVwaWNBFeNQuxPq');

app.post('/webhook', async (req, res) => {
  const msg = req.body.message?.toLowerCase() || '';
  try {
    if (msg.includes('qcm')) {
      const records = await base('Question_M1').select({filterByFormula: '{Monde} = 1'}).all();
      if(records.length === 0) return res.json({ reply: "Ajoute des questions dans Airtable frérot" });
      const q = records[Math.floor(Math.random() * records.length)].fields;
      const reply = `🌍 *MONDE 1*\n\n*${q.Question}*\n\nA) ${q.Choix1}\nB) ${q.Choix2}\nC) ${q.Choix3}\nD) ${q.Choix4}\n\nRéponds A, B, C ou D`;
      res.json({ reply });
    } else {
      res.json({ reply: "Tape 'qcm' pour commencer 🚀" });
    }
  } catch (e) {
    res.json({ reply: "Erreur Airtable: " + e.message });
  }
});

app.get('/', (req, res) => res.send('Bot Quiz LIVE'));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Bot ready on ' + port));
