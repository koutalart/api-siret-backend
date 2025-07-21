const siretInput = document.getElementById('siretInput');
const checkBtn = document.getElementById('checkBtn');
const errorMsg = document.getElementById('errorMsg');
const entrepriseDetails = document.getElementById('entrepriseDetails');
const confirmBtn = document.getElementById('confirmBtn');
const editBtn = document.getElementById('editBtn');

checkBtn.addEventListener('click', async () => {
  const siret = siretInput.value.trim();
  if (siret.length !== 14 || isNaN(siret)) {
    errorMsg.textContent = "Le numéro SIRET doit contenir 14 chiffres.";
    return;
  }

  errorMsg.textContent = '';
  try {
    const res = await fetch(`https://api-siret-backend.onrender.com/siret/${siret}`);
    const data = await res.json();

    if (data.error || !data.etablissement) {
      errorMsg.textContent = "🚫 Entreprise non trouvée. Vérifie le numéro SIRET saisi.";
      return;
    }

    const etab = data.etablissement;
    const uni = data.etablissement.uniteLegale;
    entrepriseDetails.innerHTML = `
      <strong>Nom :</strong> ${uni.denominationUniteLegale || uni.nomUniteLegale || '—'}<br/>
      <strong>Adresse :</strong> ${(etab.adresseEtablissement.numeroVoie ?? '') + ' ' + (etab.adresseEtablissement.libelleVoie ?? '') + ', ' + etab.adresseEtablissement.codePostal + ' ' + etab.adresseEtablissement.libelleCommune}<br/>
      <strong>Activité :</strong> ${uni.activitePrincipale}<br/>
    `;
    document.getElementById('step-siret').style.display = 'none';
    document.getElementById('step-confirm').style.display = 'block';

  } catch (err) {
    console.error("Erreur API :", err);
    errorMsg.textContent = "⚠️ Problème temporaire. Réessaie dans quelques instants.";
  }
});

confirmBtn.addEventListener('click', () => {
  document.getElementById('step-confirm').style.display = 'none';
  document.getElementById('step-next').style.display = 'block';
  // Exemple de redirection :
  // window.location.href = '/page-suivante';
});

editBtn.addEventListener('click', () => {
  document.getElementById('step-confirm').style.display = 'none';
  document.getElementById('step-siret').style.display = 'block';
});