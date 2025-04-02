const BASE_URL = 'https://workflows.aphelionxinnovations.com';
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiZmJmMmI1ZjctZTc3ZS00ZGZmLWJlN2UtN2ZlOGVkZmViZmY1IiwiZmlyc3ROYW1lIjoiTW91c3NhIiwibGFzdE5hbWUiOiJTYWlkaSIsInVzZXJuYW1lIjoic2FpZGkiLCJlbWFpbCI6Im1vdXNzYS5zYWlkaS4wMUBnbXppbC5jb20iLCJwYXNzd29yZCI6ImFkbWluMTIzNCIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTc0Mjk1MjMyNn0.1s_IWO-h-AKwkP0LIX8mcjdeLRwsRtgbqAchIJSRVEA';

// Handle patient creation
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

// Handle patient lookup
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

    const {
      ipp,
      nom,
      prenom,
      cin: patientCin,
      telephone,
      adresse,
      ville,
      date_naissance,
      sexe,
      has_insurance,
      mutuelle,
      created_at,
      qr_code
    } = data;

    const card = `
      <div style="padding: 20px; background: #ecf0f1; border-radius: 10px; margin-top: 20px;">
        <h3>👤 ${prenom} ${nom}</h3>
        <p><strong>🆔 CIN:</strong> ${patientCin}</p>
        <p><strong>📋 IPP:</strong> ${ipp}</p>
        <p><strong>📞 Téléphone:</strong> ${telephone}</p>
        <p><strong>🏠 Adresse:</strong> ${adresse}, ${ville}</p>
        <p><strong>📅 Naissance:</strong> ${new Date(date_naissance).toLocaleDateString()}</p>
        <p><strong>🧬 Sexe:</strong> ${sexe === 'M' ? 'Homme' : 'Femme'}</p>
        <p><strong>💊 Mutuelle:</strong> ${has_insurance ? mutuelle.toUpperCase() : 'Non assuré'}</p>
        <p><strong>🕓 Créé le:</strong> ${new Date(created_at).toLocaleString()}</p>
        <br />
        <button onclick="printQRCode('${qr_code}')">🖨️ Imprimer le QR Code</button>
      </div>
    `;

    getResult.innerHTML = card;

  } catch (err) {
    getResult.innerHTML = `<p class="error">Erreur serveur ou réseau !</p>`;
    console.error(err);
  }
}

// Print QR Code only
function printQRCode(qrUrl) {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Imprimer le QR Code</title>
        <style>
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            font-family: sans-serif;
          }
          img {
            border: 1px solid #333;
            padding: 10px;
          }
        </style>
      </head>
      <body>
        <img src="${qrUrl}" alt="QR Code" />
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `);
}
