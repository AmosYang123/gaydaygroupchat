document.addEventListener('DOMContentLoaded', () => {
    const dashboardContent = document.getElementById('dashboard-content');
    const applicantListBody = document.getElementById('applicant-list');

    // --- Mock Data ---
    // In a real application, this data would be fetched from Firebase/Google Sheets via an n8n workflow.
    const mockApplicants = [
        { name: 'John Doe', email: 'john.d@example.com', status: 'pending', currentTile: 0, videoURL: null },
        { name: 'Jane Smith', email: 'jane.s@example.com', status: 'in-progress', currentTile: 15, videoURL: null },
        { name: 'Sam Wilson', email: 'sam.w@example.com', status: 'awaiting-video-review', currentTile: 30, videoURL: 'https://example.com/video/sam_wilson.mp4' },
        { name: 'Bucky Barnes', email: 'bucky.b@example.com', status: 'completed', currentTile: 49, videoURL: 'https://example.com/video/bucky_b.mp4' },
    ];

    // --- Load and Render Applicant Data ---
    function loadApplicants() {
        // Clear existing list
        applicantListBody.innerHTML = '';

        mockApplicants.forEach(applicant => {
            const row = document.createElement('tr');

            // Define actions based on status
            let actionsHtml = '';
            if (applicant.status === 'pending') {
                actionsHtml = `<button class="action-btn approve">Approve Start</button> <button class="action-btn deny">Reject</button>`;
            } else if (applicant.status === 'awaiting-video-review') {
                actionsHtml = `<button class="action-btn executive">Executive Order</button>`;
            } else {
                actionsHtml = `<span>No actions available</span>`;
            }

            row.innerHTML = `
                <td>${applicant.name}</td>
                <td>${applicant.email}</td>
                <td><span class="status-${applicant.status}">${applicant.status.replace('-', ' ')}</span></td>
                <td>${applicant.currentTile}</td>
                <td>${applicant.videoURL ? `<a href="${applicant.videoURL}" target="_blank">View Video</a>` : 'N/A'}</td>
                <td class="actions">${actionsHtml}</td>
            `;

            applicantListBody.appendChild(row);
        });
    }

    // --- Event Delegation for Action Buttons ---
    applicantListBody.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON') {
            const email = target.closest('tr').children[1].textContent;
            if (target.classList.contains('approve')) {
                console.log(`Approving ${email} to start qualification...`);
                // n8n webhook call would go here
            } else if (target.classList.contains('deny')) {
                console.log(`Denying access for ${email}...`);
                // n8n webhook call would go here
            } else if (target.classList.contains('executive')) {
                console.log(`Issuing executive order for ${email}...`);
                // n8n webhook call would go here
            }
        }
    });

    loadApplicants();
});
