document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('access-form');
    const confirmationMessage = document.getElementById('confirmation-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');

        // NOTE: This is a placeholder. Replace with your actual n8n webhook URL.
        const webhookUrl = 'https://n8n.example.com/webhook/1234-5678-9012-3456';

        try {
            // Simulate a successful API call for now
            console.log('Submitting to:', webhookUrl);
            console.log('Data:', { name, email });

            // In a real scenario, you would have the fetch call here:
            /*
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            if (response.ok) {
                form.style.display = 'none';
                confirmationMessage.style.display = 'block';
            } else {
                alert('There was an error submitting your request. Please try again.');
            }
            */

            // Faking success for the UI demo
            localStorage.setItem('userEmail', email); // Store email for later use
            form.style.display = 'none';
            confirmationMessage.style.display = 'block';

        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your request. Please try again.');
        }
    });
});
