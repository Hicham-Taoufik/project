const BASE_URL = 'https://workflows.aphelionxinnovations.com';
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiZmJmMmI1ZjctZTc3ZS00ZGZmLWJlN2UtN2ZlOGVkZmViZmY1IiwiZmlyc3ROYW1lIjoiTW91c3NhIiwibGFzdE5hbWUiOiJTYWlkaSIsInVzZXJuYW1lIjoic2FpZGkiLCJlbWFpbCI6Im1vdXNzYS5zYWlkaS4wMUBnbXppbC5jb20iLCJwYXNzd29yZCI6ImFkbWluMTIzNCIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTc0Mjk1MjMyNn0.1s_IWO-h-AKwkP0LIX8mcjdeLRwsRtgbqAchIJSRVEA';


document.getElementById('createForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const message = document.getElementById('message');
  message.textContent = '';
  message.className = '';

  const data = Object.fromEntries(new FormData(this));
  data.has_insurance = this.has_insurance.checked;

  try {
    const response = await fetch(`${BASE_URL}/webhook/create-patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': TOKEN
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      message.textContent = '✅ Patient créé avec succès !';
      message.className = 'success';
      this.reset(); // clear form after success
    } else {
      message.textContent = '❌ Erreur: ' + (result.message || 'Vérifie les champs');
      message.className = 'error';
    }
  } catch (err) {
    message.textContent = 'Erreur réseau ou serveur !';
    message.className = 'error';
    console.error(err);
  }
});

async function getPatient() {
  const cin = document.getElementById('getCin').value;
  const getResult = document.getElementById('getResult');
  getResult.innerHTML = '';

  try {
    const response = await fetch(`${BASE_URL}/webhook/get-patient?cin=${cin}`, {
      headers: { 'Authorization': TOKEN }
    });

    const data = await response.json();

    if (!response.ok || !data || Object.keys(data).length === 0) {
      getResult.innerHTML = `<p class="error">❌ Patient non trouvé.</p>`;
      return;
    }

    const card = `
      <div style="padding: 20px; background: #ecf0f1; border-radius: 10px;">
        <h3>${data.prenom} ${data.nom}</h3>
        <p><strong>CIN:</strong> ${data.cin}</p>
        <p><strong>Téléphone:</strong> ${data.telephone}</p>
        <p><strong>Adresse:</strong> ${data.adresse}, ${data.ville}</p>
        <p><strong>Date de naissance:</strong> ${data.date_naissance}</p>
        <p><strong>Sexe:</strong> ${data.sexe === 'M' ? 'Homme' : 'Femme'}</p>
        <p><strong>Mutuelle:</strong> ${data.has_insurance ? data.mutuelle : 'Non'}</p>
      </div>
    `;

    getResult.innerHTML = card;

  } catch (err) {
    getResult.innerHTML = `<p class="error">Erreur serveur ou réseau !</p>`;
    console.error(err);
  }
}
