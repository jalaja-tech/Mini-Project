// --- Period Tracker Logic ---
function calculatePeriod() {
    const lastDateInput = document.getElementById('lastPeriodDate').value;
    const cycleLength = parseInt(document.getElementById('cycleLength').value);
    const resultBox = document.getElementById('periodResult');

    if (!lastDateInput) {
        alert("Please select a date!");
        return;
    }

    let lastDate = new Date(lastDateInput);
    
    // Calculate Next Period
    let nextPeriod = new Date(lastDate);
    nextPeriod.setDate(lastDate.getDate() + cycleLength);

    // Calculate Ovulation (approx 14 days before next period)
    let ovulation = new Date(nextPeriod);
    ovulation.setDate(nextPeriod.getDate() - 14);

    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `
        <strong>Next Period:</strong> ${nextPeriod.toDateString()}<br>
        <strong>Ovulation window starts:</strong> ${ovulation.toDateString()}
    `;
}

// --- Medicine Tracker Logic ---
function addMedicine() {
    const name = document.getElementById('medName').value;
    const time = document.getElementById('medTime').value;

    if (!name || !time) {
        alert("Please enter medicine details!");
        return;
    }

    // Add to UI list
    const list = document.getElementById('medList');
    const li = document.createElement('li');
    li.className = 'med-item';
    li.innerHTML = `<span>${name}</span> <strong>${time}</strong>`;
    list.appendChild(li);

    // Start background timer for this medicine
    startReminder(name, time);
}

function startReminder(name, targetTime) {
    // Check every 30 seconds
    setInterval(() => {
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                            now.getMinutes().toString().padStart(2, '0');
        
        if (currentTime === targetTime) {
            alert(`⏰ REMINDER: Take your ${name}!`);
        }
    }, 30000); 
}