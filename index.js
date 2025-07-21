const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/siret/:siret', async (req, res) => {
  const siret = req.params.siret;
  const url = `https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/${siret}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.etablissement) {
      return res.status(404).json({ error: "Entreprise non trouvée" });
    }

    const { denomination, nom_raison_sociale, adresse } = data.etablissement;
    res.json({
      nom: denomination || nom_raison_sociale || "Nom indisponible",
      adresse: adresse || "Adresse indisponible",
    });

  } catch (error) {
    console.error("Erreur côté backend :", error);
    res.status(500).json({ error: "Erreur serveur. Réessaie plus tard." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API SIRET listening on port ${PORT}`);
});