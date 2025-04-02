const BASE_URL = 'https://workflows.aphelionxinnovations.com';
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicmVjZXB0aW9uIiwiaWF0IjoxNzQyNzY3MTk3fQ.JM5x28Gc-NQxuKu0hymv5UCjT8Qm98qWilT3_VztPwE';

document.getElementById('createForm').addEventListener('submit', async function (e) {
  e.preventDefault();
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
      alert('✅ Patient créé avec succès !');
      console.log(result);
    } else {
      alert('❌ Erreur: ' + (result.message || 'Vérifie les champs'));
      console.error(result);
    }
  } catch (err) {
    alert('Erreur réseau ou serveur !');
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
