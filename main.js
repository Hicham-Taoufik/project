const BASE_URL = 'https://workflows.aphelionxinnovations.com/webhook'; // no trailing slash
const ipp = 'IPP-1742812227738'; // Just an example. You might set this dynamically.

window.addEventListener('DOMContentLoaded', async () => {
  // 1) Load patient data automatically
  await loadPatientInfo(ipp);

  // Add event listeners for your buttons
  document.getElementById('submit-diagnostic-btn')
    .addEventListener('click', submitDiagnostic);

  document.getElementById('submit-prescription-btn')
    .addEventListener('click', submitPrescription);

  document.getElementById('validate-prescription-btn')
    .addEventListener('click', validatePrescription);

  document.getElementById('modify-prescription-btn')
    .addEventListener('click', () => {
      alert('You can let the doctor change the suggestion fields manually, e.g. open a form modal or make them editable.');
    });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  Load patient info
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function loadPatientInfo(ipp) {
  try {
    // GET /doctor-get-patient?ipp=<value>
    const res = await fetch(`${BASE_URL}/webhook/doctor-get-patient?ipp=${ipp}`);
    if (!res.ok) throw new Error('Failed to load patient info');
    const data = await res.json();

    // Update the UI
    document.getElementById('patient-ipp').textContent = data.ipp || 'N/A';
    document.getElementById('patient-nom').textContent = data.nom || 'N/A';
    document.getElementById('patient-prenom').textContent = data.prenom || 'N/A';
    document.getElementById('patient-mutuelle').textContent = data.mutuelle || 'N/A';

    // Optionally load patient history in the same function
    // e.g. if you have an endpoint: GET /doctor-get-history?ipp=...
    // update #history-list with previous consultations
  } catch (err) {
    console.error(err);
    alert('Error loading patient data!');
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  Submit diagnostic
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function submitDiagnostic() {
  const diagnosticText = document.getElementById('diagnostic-input').value.trim();
  if (!diagnosticText) {
    alert('Please enter a diagnostic first.');
    return;
  }
  try {
    const res = await fetch(`${BASE_URL}/webhook/doctor-submit-diagnostic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ipp, diagnostic: diagnosticText })
    });

    const data = await res.json();
    if (data.success) {
      alert('Diagnostic saved successfully!');
      // You might also clear the field or show a success banner
    } else {
      alert('Diagnostic save failed.');
    }
  } catch (err) {
    console.error(err);
    alert('Error submitting diagnostic.');
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  Submit prescription for AI suggestion
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function submitPrescription() {
  const prescriptionText = document.getElementById('prescription-input').value.trim();
  if (!prescriptionText) {
    alert('Please enter prescription text first.');
    return;
  }
  try {
    const res = await fetch(`${BASE_URL}/webhook/doctor-submit-prescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ipp, prescription: prescriptionText })
    });

    const data = await res.json();
    // data might look like:
    // {
    //   success: true,
    //   message: "Prescription suggestion generated",
    //   suggestion: { medicament, start_date, end_date, schedule: { matin, ... } }
    // }
    if (data.success) {
      alert(data.message || 'Got AI suggestion!');
      const suggestion = data.suggestion || {};

      // Show in the UI
      document.getElementById('suggest-start').textContent = suggestion.start_date || 'N/A';
      document.getElementById('suggest-end').textContent = suggestion.end_date || 'N/A';

      updateScheduleBadge('check-matin', suggestion.schedule?.matin);
      updateScheduleBadge('check-apres-midi', suggestion.schedule?.apres_midi);
      updateScheduleBadge('check-soir', suggestion.schedule?.soir);
      updateScheduleBadge('check-nuit', suggestion.schedule?.nuit);

    } else {
      alert('AI suggestion failed or returned no data.');
    }
  } catch (err) {
    console.error(err);
    alert('Error submitting prescription for suggestion.');
  }
}

function updateScheduleBadge(elementId, isTrue) {
  const el = document.getElementById(elementId);
  if (isTrue) {
    el.classList.remove('bg-secondary');
    el.classList.add('bg-success');
  } else {
    el.classList.remove('bg-success');
    el.classList.add('bg-secondary');
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  Validate / Finalize the prescription
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function validatePrescription() {
  // In a real flow, you'd gather the final medicament name, start_date, end_date, etc.
  // For now, we’ll assume we accept the AI suggestion as-is.

  const finalPrescription = document.getElementById('prescription-input').value.trim();
  const startDate = document.getElementById('suggest-start').textContent || '';
  const endDate = document.getElementById('suggest-end').textContent || '';

  const schedule = {
    matin: document.getElementById('check-matin').classList.contains('bg-success'),
    apres_midi: document.getElementById('check-apres-midi').classList.contains('bg-success'),
    soir: document.getElementById('check-soir').classList.contains('bg-success'),
    nuit: document.getElementById('check-nuit').classList.contains('bg-success'),
  };

  // You could store the "medicament_name" from your AI suggestion if you’re extracting it separately.
  // Here we’ll guess it's the first word of the finalPrescription or you’ll store it somewhere else.
  const medicament_name = finalPrescription.split(' ')[0] || 'Unknown';

  try {
    const res = await fetch(`${BASE_URL}/webhook/doctor-validate-prescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ipp,
        final_prescription: finalPrescription,
        start_date: startDate,
        end_date: endDate,
        schedule,
        medicament_name
      })
    });

    const data = await res.json();
    if (data.success) {
      alert(data.message || 'Prescription validated!');
      // Possibly reset the fields or update the UI
    } else {
      alert('Validation failed or no success message.');
    }
  } catch (err) {
    console.error(err);
    alert('Error validating prescription.');
  }
}
