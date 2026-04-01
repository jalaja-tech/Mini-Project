// ================= NOTIFICATION PERMISSION =================
if ("Notification" in window) {
    Notification.requestPermission();
}

// ================= COMMON NOTIFICATION =================
function showNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("Health Tracker", {
            body: message,
            icon: "https://cdn-icons-png.flaticon.com/512/2966/2966483.png"
        });
    } else {
        alert(message);
    }
}

// ================= PERIOD TRACKER =================
function calculatePeriod() {
    const lastDateInput = document.getElementById('lastPeriodDate').value;
    const cycleLength = parseInt(document.getElementById('cycleLength').value);
    const resultBox = document.getElementById('periodResult');

    if (!lastDateInput) {
        alert("Please select a date!");
        return;
    }

    let lastDate = new Date(lastDateInput);

    let nextPeriod = new Date(lastDate);
    nextPeriod.setDate(lastDate.getDate() + cycleLength);

    let ovulation = new Date(nextPeriod);
    ovulation.setDate(nextPeriod.getDate() - 14);

    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `
        <strong>Next Period:</strong> ${nextPeriod.toDateString()}<br>
        <strong>Ovulation window starts:</strong> ${ovulation.toDateString()}
    `;

    // Save for reminders
    localStorage.setItem("nextPeriodDate", nextPeriod.toISOString());
}

// ================= PERIOD REMINDER =================
function schedulePeriodReminder() {
    let lastNotified = "";

    setInterval(() => {
        const storedDate = localStorage.getItem("nextPeriodDate");
        if (!storedDate) return;

        const nextPeriod = new Date(storedDate);
        const now = new Date();

        const diffDays = Math.ceil((nextPeriod - now) / (1000 * 60 * 60 * 24));

        if (diffDays === 2 && lastNotified !== "2days") {
            showNotification("🩸 Period expected in 2 days");
            lastNotified = "2days";
        }

        if (diffDays === 0 && lastNotified !== "today") {
            showNotification("🩸 Period expected today");
            lastNotified = "today";
        }

    }, 60000);
}

// ================= MEDICINE TRACKER =================
function addMedicine() {
    const name = document.getElementById('medName').value;
    const time = document.getElementById('medTime').value;

    if (!name || !time) {
        alert("Please enter medicine details!");
        return;
    }

    const medicine = { name, time };

    let meds = JSON.parse(localStorage.getItem("medicines")) || [];
    meds.push(medicine);
    localStorage.setItem("medicines", JSON.stringify(meds));

    renderMedicines();
}

// ================= RENDER MEDICINES =================
function renderMedicines() {
    const list = document.getElementById('medList');
    list.innerHTML = "";

    let meds = JSON.parse(localStorage.getItem("medicines")) || [];

    meds.forEach((med) => {
        const li = document.createElement('li');
        li.className = 'med-item';
        li.innerHTML = `<span>${med.name}</span> <strong>${med.time}</strong>`;
        list.appendChild(li);

        scheduleMedicineReminder(med.name, med.time);
    });
}

// ================= MEDICINE REMINDER =================
function scheduleMedicineReminder(name, time) {
    const [hours, minutes] = time.split(":");
    let triggeredToday = false;

    setInterval(() => {
        const now = new Date();

        if (
            now.getHours() == hours &&
            now.getMinutes() == minutes &&
            !triggeredToday
        ) {
            showNotification(`💊 Take your ${name}`);
            triggeredToday = true;
        }

        // Reset daily
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            triggeredToday = false;
        }

    }, 1000);
}

// ================= SOS CONTACT SAVE =================
function saveSOSContacts() {
    const phone = document.getElementById("sosPhone").value;

    if (!phone) {
        alert("Enter phone number");
        return;
    }

    localStorage.setItem("sosPhone", phone);
    alert("SOS contact saved");
}

// ================= SOS FUNCTION =================
function sendSOS() {
    const phone = localStorage.getItem("sosPhone");

    if (!phone) {
        alert("No SOS contact saved!");
        return;
    }

    let message = "🚨 EMERGENCY! I need help immediately!";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const locationLink = `https://maps.google.com/?q=${lat},${lon}`;
            const fullMessage = `${message}\nLocation: ${locationLink}`;

            triggerWhatsApp(phone, fullMessage);
            triggerSMS(phone, fullMessage);

            showNotification("🚨 SOS sent with location");

        }, () => {
            triggerWhatsApp(phone, message);
            triggerSMS(phone, message);
        });
    } else {
        triggerWhatsApp(phone, message);
        triggerSMS(phone, message);
    }
}

// ================= WHATSAPP =================
function triggerWhatsApp(phone, message) {
    const encodedMsg = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encodedMsg}`;
    window.open(url, "_blank");
}

// ================= SMS =================
function triggerSMS(phone, message) {
    const encodedMsg = encodeURIComponent(message);
    const smsURL = `sms:${phone}?body=${encodedMsg}`;
    window.open(smsURL, "_self");
}

// ================= INITIAL LOAD =================
window.onload = function () {
    renderMedicines();
    schedulePeriodReminder();
};
