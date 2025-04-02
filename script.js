const BASE_URL = 'https://workflows.aphelionxinnovations.com';
const TOKEN = 'Bearer eyJhbGciOi...PwE'; // Add your full token here

document.getElementById('createForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(this));
  data.has_insurance = this.has_insurance.checked;

  const response = await fetch(`${BASE_URL}/webhook/create-patient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': TOKEN
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  alert('Patient créé !');
  console.log(result);
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
