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
  const response = await fetch(`${BASE_URL}/webhook/get-patient?cin=${cin}`, {
    headers: { 'Authorization': TOKEN }
  });

  const data = await response.json();
  document.getElementById('getResult').textContent = JSON.stringify(data, null, 2);
}

async function listPatients() {
  const response = await fetch(`${BASE_URL}/webhook/list-patients`);
  const data = await response.json();
  document.getElementById('listResult').textContent = JSON.stringify(data, null, 2);
}
