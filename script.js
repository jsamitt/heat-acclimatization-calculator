// Heat Acclimatization Calculator
document.addEventListener('DOMContentLoaded', () => {
  const inputs = ['fitness', 'days-on-job', 'typical-hours'];
  const output = document.getElementById('output');

  // Update on any change
  inputs.forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('change', calculatePlan);
    el.addEventListener('input', calculatePlan);
  });

  function calculatePlan() {
    const fitness = document.getElementById('fitness').value;
    const days = document.getElementById('days-on-job').value;
    const hours = parseFloat(document.getElementById('typical-hours').value) || 0;

    // Basic validation
    if (!fitness || !days || hours <= 0) {
      output.innerHTML = '<p class="placeholder">Please complete all fields.</p>';
      return;
    }

    // === PLACEHOLDER LOGIC ===
    // We'll replace this with OSHA/NIOSH-based rules in the next step
    const planHTML = `
      <h3>Your Acclimatization Plan</h3>
      <p class="plan">
        <strong>Fitness:</strong> ${fitness}<br>
        <strong>Day:</strong> ${days.split('-').join(' ')}<br>
        <strong>Typical Hours:</strong> ${hours}<br><br>
        <em>Full logic coming in the next message...</em>
      </p>
    `;
    output.innerHTML = planHTML;
  }

  // Initial calc
  calculatePlan();
});
