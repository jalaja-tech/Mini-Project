function toggleView() {
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');

    // Simple toggle logic
    if (loginView.classList.contains('hidden')) {
        loginView.classList.remove('hidden');
        signupView.classList.add('hidden');
    } else {
        loginView.classList.add('hidden');
        signupView.classList.remove('hidden');
    }
}

// Optional: Console log to verify it's working
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Form Submitted for Pransetu App");
    });
});
