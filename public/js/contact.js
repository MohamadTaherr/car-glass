document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real application, you would send this data to the server.
        // For now, we'll just show a success message.
        formStatus.textContent = 'Thank you for your message!';
        contactForm.reset();
    });
});
