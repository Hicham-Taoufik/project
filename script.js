const BASE_URL = 'https://workflows.aphelionxinnovations.com';
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiZmJmMmI1ZjctZTc3ZS00ZGZmLWJlN2UtN2ZlOGVkZmViZmY1IiwiZmlyc3ROYW1lIjoiTW91c3NhIiwibGFzdE5hbWUiOiJTYWlkaSIsInVzZXJuYW1lIjoic2FpZGkiLCJlbWFpbCI6Im1vdXNzYS5zYWlkaS4wMUBnbXppbC5jb20iLCJwYXNzd29yZCI6ImFkbWluMTIzNCIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTc0Mjk1MjMyNn0.1s_IWO-h-AKwkP0LIX8mcjdeLRwsRtgbqAchIJSRVEA';
// Search and display patient info
function getPatient() {
  const cin = document.getElementById("getCin").value;
  const url = `https://workflows.aphelionxinnovations.com/webhook/get-patient?cin=${cin}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data || !data.nom) {
        document.getElementById("getResult").innerHTML =
          "<p class='error'>Patient non trouvé.</p>";
        return;
      }

      const qr = data.qr_code || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${cin}`;

      document.getElementById("getResult").innerHTML = `
        <div>
          <h3>👤 ${data.prenom} ${data.nom}</h3>
          <p>🆔 <strong>CIN:</strong> ${data.cin}</p>
          <p>📘 <strong>IPP:</strong> ${data.ipp}</p>
          <p>📞 <strong>Téléphone:</strong> ${data.telephone}</p>
          <p>🏡 <strong>Adresse:</strong> ${data.adresse}</p>
          <p>📅 <strong>Naissance:</strong> ${new Date(data.date_naissance).toLocaleDateString()}</p>
          <p>🧬 <strong>Sexe:</strong> ${data.sexe}</p>
          <p>💳 <strong>Mutuelle:</strong> ${data.mutuelle || "Non"}</p>
          <p>🕒 <strong>Créé le:</strong> ${new Date(data.created_at).toLocaleString()}</p>
          <img src="${qr}" class="qrcode" />
          <br/><br/>
          <button onclick="printQRCode('${qr}')" class="btn-secondary">🖨️ Imprimer le QR Code</button>
        </div>
      `;
    })
    .catch(() => {
      document.getElementById("getResult").innerHTML =
        "<p class='error'>Erreur lors de la récupération des données.</p>";
    });
}

// Print the QR Code with logo and clean layout
function printQRCode(qrUrl) {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Imprimer le QR Code</title>
        <style>
          body {
            font-family: 'Inter', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: white;
          }
          img.logo {
            width: 100px;
            margin-bottom: 20px;
          }
          img.qrcode {
            width: 300px;
            border: 2px solid #007BFF;
            padding: 10px;
          }
        </style>
      </head>
      <body>
        <img src="logo.webp" alt="Clinic Logo" class="logo" />
        <img src="${qrUrl}" alt="QR Code" class="qrcode" />
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </body>
    </html>
  `);
}

// Optional: handle form submission
document.getElementById("createForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const payload = {
    nom: form.nom.value,
    prenom: form.prenom.value,
    cin: form.cin.value,
    telephone: form.telephone.value,
    adresse: form.adresse.value,
    ville: form.ville.value,
    date_naissance: form.date_naissance.value,
    sexe: form.sexe.value,
    has_insurance: form.has_insurance.checked,
    mutuelle: form.mutuelle.value || ""
  };

  fetch("https://workflows.aphelionxinnovations.com/webhook/create-patient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("message").innerHTML = "<span class='success'>✅ Patient créé avec succès.</span>";
      form.reset();
    })
    .catch(() => {
      document.getElementById("message").innerHTML = "<span class='error'>❌ Erreur lors de la création du patient.</span>";
    });
});
