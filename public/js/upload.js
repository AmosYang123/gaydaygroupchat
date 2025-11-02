document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const uploadConfirmation = document.getElementById('upload-confirmation');

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(uploadForm);
        const videoFile = formData.get('video');
        const userEmail = localStorage.getItem('userEmail'); // Assuming email is stored from login/initial step

        if (!videoFile) {
            alert('Please select a video file to upload.');
            return;
        }

        // NOTE: Replace with your actual n8n webhook URL for file uploads
        const webhookUrl = 'https://n8n.example.com/webhook/upload-video';

        // Create a new FormData to send both file and user info
        const submissionData = new FormData();
        submissionData.append('video', videoFile);
        submissionData.append('email', userEmail || 'unknown@example.com'); // Fallback email

        try {
            console.log('Uploading to:', webhookUrl);

            // In a real scenario, you would have the fetch call here:
            /*
            const response = await fetch(webhookUrl, {
                method: 'POST',
                body: submissionData, // No 'Content-Type' header needed for FormData
            });

            if (response.ok) {
                uploadForm.style.display = 'none';
                uploadConfirmation.style.display = 'block';
            } else {
                alert('There was an error uploading your video. Please try again.');
            }
            */

            // Faking success for the UI demo
            uploadForm.style.display = 'none';
            uploadConfirmation.style.display = 'block';

        } catch (error) {
            console.error('Error:', error);
            alert('There was an error uploading your video. Please try again.');
        }
    });
});
