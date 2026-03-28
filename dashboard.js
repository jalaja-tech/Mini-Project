// Display current date on dashboard
function updateDate() {
    const dateElement = document.getElementById('current-date');
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.innerText = now.toLocaleDateString(undefined, options);
}

// Handle Navigation
function navigateTo(service) {
    if (service === 'sos') {
        alert("🚨 EMERGENCY ALERT! Notifying your medical contacts immediately.");
    } else {
        alert("Navigating to " + service.charAt(0).toUpperCase() + service.slice(1) + " Section...");
        // In a real app, use: window.location.href = service + ".html";
    }
}

// Initialize
updateDate();
