// Heat Acclimatization Calculator – FIXED & WORKING
document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('output');
  const useFitnessCheckbox = document.getElementById('use-fitness');
  const fitnessSelect = document.getElementById('fitness');
  const fitnessField = document.getElementById('fitness-field');

  // Toggle fitness field visibility and enabled state
  function toggleFitnessField() {
    const enabled = useFitnessCheckbox.checked;
    fitnessSelect.disabled = !enabled;
    fitnessField.classList.toggle('disabled', !enabled);
  }

  // Attach event listeners
  useFitnessCheckbox.addEventListener('change', () => {
    toggleFitnessField();
    calculatePlan(); // Recalculate immediately
  });

  ['days-on-job', 'typical-hours', 'fitness'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('change', calculatePlan);
    el.addEventListener('input', calculatePlan);
  });

  // Initial state
  toggleFitnessField();

  // Main calculation function
  function calculatePlan() {
    const daysKey = document.getElementById('days-on-job').value;
    const typicalHours = parseFloat(document.getElementById('typical-hours').value) || 0;
    const useFitness = useFitnessCheckbox.checked;
    const fitness = useFitness ? fitnessSelect.value : 'average';

    // Validation
    if (!daysKey || typicalHours <= 0) {
      output.innerHTML = '<p class="placeholder">Please complete all required fields.</p>';
      return;
    }

    const [type, dayStr] = daysKey.split('-');
    const isNew = type === 'new';
    const dayNum = dayStr === '10plus' ? 10 : (dayStr === '4plus' ? 4 : parseInt(dayStr));

    // Base OSHA/NIOSH
    let baseStart = isNew ? 20 : 50;
    let baseDailyIncrease = 20;

    let currentPercent = baseStart;
    let dailyIncrease = baseDailyIncrease;
    let fitnessLabel = 'Average (OSHA/NIOSH Standard)';
    let customNote = '';

    if (useFitness && fitness !== 'average') {
      let startAdj = 0;
      let dailyAdj = 0;

      switch (fitness) {
        case 'athletic':
          startAdj = isNew ? 10 : 15;
          dailyAdj = 5;
          fitnessLabel = 'Athletic (custom faster ramp-up)';
          break;
        case 'sedentary':
          startAdj = isNew ? -10 : -15;
          dailyAdj = -5;
          fitnessLabel = 'Sedentary (custom slower ramp-up)';
          break;
        case 'health':
          startAdj = isNew ? -15 : -20;
          dailyAdj = -10;
          fitnessLabel = 'Health Conditions (custom slowest ramp-up)';
          break;
      }

      currentPercent = Math.max(20, baseStart + startAdj);
      dailyIncrease = Math.max(10, baseDailyIncrease + dailyAdj);
      customNote = `<p class="note"><strong>Custom Adjustment:</strong> This schedule modifies OSHA/NIOSH guidance based on fitness. Use with caution and consult a safety professional.</p>`;
    }

    // Build plan
    let planHTML = `<h3>Your Acclimatization Plan</h3>`;
    planHTML += `<p><strong>Fitness Basis:</strong> ${fitnessLabel}</p>`;
    planHTML += `<p><strong>Worker Type:</strong> ${isNew ? 'New Worker' : 'Returning (5+ days off)'}</p>`;
    planHTML += `<p><strong>Typical Full Day:</strong> ${typicalHours} hours</p><br>`;

    planHTML += `<table class="plan-table"><thead><tr><th>Day</th><th>Exposure %</th><th>Hours Allowed</th><th>Notes</th></tr></thead><tbody>`;

    for (let d = 1; d <= dayNum; d++) {
      const hoursAllowed = Math.min(typicalHours, (currentPercent / 100) * typicalHours).toFixed(1);
      const note = currentPercent >= 100 ? 'Full acclimatization reached' : 'Monitor for heat stress';

      planHTML += `<tr>
        <td><strong>Day ${d}</strong></td>
        <td>${currentPercent.toFixed(0)}%</td>
        <td>${hoursAllowed} hrs</td>
        <td>${note}</td>
      </tr>`;

      if (d < dayNum) {
        currentPercent = Math.min(100, currentPercent + dailyIncrease);
      }
    }

    planHTML += `</tbody></table>`;
    planHTML += `<button onclick="window.print()" class="print-btn">Print / Save as PDF</button>`;
    planHTML += customNote;

    output.innerHTML = planHTML;
  }

  // Initial calculation
  calculatePlan();
});
