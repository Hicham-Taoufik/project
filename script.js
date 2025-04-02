function getPatient() {
  const cin = document.getElementById("getCin").value;
  const url = `https://workflows.aphelionxinnovations.com/webhook/get-patient?cin=${cin}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data || !data.nom) {
        document.getElementById("getResult").innerHTML = "<p class='error'>Patient non trouvé.</p>";
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
      document.getElementById("getResult").innerHTML = "<p class='error'>Erreur lors de la récupération des données.</p>";
    });
}

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
