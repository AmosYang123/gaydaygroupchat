document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('access-form');
    const confirmationMessage = document.getElementById('confirmation-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');

        const apiUrl = 'https://amosyang.app.n8n.cloud/webhook/new-application';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('userEmail', email); // Store email for later use
                form.style.display = 'none';
                confirmationMessage.textContent = result.message;
                confirmationMessage.style.display = 'block';
            } else {
                alert(result.message || 'There was an error submitting your request.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your request. Please try again.');
        }
    });
});
