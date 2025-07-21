import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

let cachedToken = null;
let tokenExpiresAt = null;

async function getToken() {
  const creds = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');
  const now = Date.now();

  if (cachedToken && tokenExpiresAt && now < tokenExpiresAt) {
    return cachedToken;
  }

  const res = await fetch('https://api.insee.fr/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;
  return cachedToken;
}

app.get('/siret/:siret', async (req, res) => {
  const token = await getToken();
  const siret = req.params.siret;

  const response = await fetch(`https://api.insee.fr/entreprises/sirene/V3/siret/${siret}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) return res.status(response.status).json({ error: 'Entreprise non trouvée' });

  const json = await response.json();
  res.json(json);
});

app.listen(PORT, () => {
  console.log(`API SIRET live sur port ${PORT}`);
});