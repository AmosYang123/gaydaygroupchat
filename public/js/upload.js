document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const uploadConfirmation = document.getElementById('upload-confirmation');
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        window.location.href = '/index.html'; // Redirect if not logged in
        return;
    }

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData();
        const videoFile = document.querySelector('input[type="file"]').files[0];

        if (!videoFile) {
            alert('Please select a video file to upload.');
            return;
        }

        formData.append('video', videoFile);
        formData.append('email', userEmail);

        const apiUrl = 'https://amosyang.app.n8n.cloud/webhook/video-upload';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                uploadForm.style.display = 'none';
                uploadConfirmation.textContent = result.message;
                uploadConfirmation.style.display = 'block';
            } else {
                alert(result.message || 'There was an error uploading your video.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error uploading your video. Please try again.');
        }
    });
});
