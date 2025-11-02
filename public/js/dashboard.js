document.addEventListener('DOMContentLoaded', () => {
    const dashboardContent = document.getElementById('dashboard-content');
    const applicantListBody = document.getElementById('applicant-list');

    const GET_APPLICANTS_URL = 'https://amosyang.app.n8n.cloud/webhook/get-applicants';
    const UPDATE_STATUS_URL = 'https://amosyang.app.n8n.cloud/webhook/update-status';

    async function loadApplicants() {
        try {
            const response = await fetch(GET_APPLICANTS_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const applicants = await response.json();
            renderApplicants(applicants);
        } catch (error) {
            console.error("Failed to fetch applicants:", error);
            applicantListBody.innerHTML = `<tr><td colspan="6">Error loading data. Is the n8n workflow active?</td></tr>`;
        }
    }

    function renderApplicants(applicants) {
        applicantListBody.innerHTML = ''; // Clear existing list

        if (!applicants || applicants.length === 0) {
            applicantListBody.innerHTML = `<tr><td colspan="6">No applicants found.</td></tr>`;
            return;
        }

        applicants.forEach(applicant => {
            const row = document.createElement('tr');

            let actionsHtml = '';
            if (applicant.status === 'pending') {
                actionsHtml = `<button class="action-btn approve" data-email="${applicant.email}" data-status="in-progress">Approve Start</button>
                               <button class="action-btn deny" data-email="${applicant.email}" data-status="denied">Reject</button>`;
            } else if (applicant.status === 'awaiting-video-review') {
                actionsHtml = `<button class="action-btn approve" data-email="${applicant.email}" data-status="approved">Approve Access</button>
                               <button class="action-btn deny" data-email="${applicant.email}" data-status="denied">Deny Access</button>`;
            } else {
                actionsHtml = `<span>No actions available</span>`;
            }

            row.innerHTML = `
                <td>${applicant.name}</td>
                <td>${applicant.email}</td>
                <td><span class="status-${applicant.status}">${applicant.status ? applicant.status.replace('-', ' ') : 'N/A'}</span></td>
                <td>${applicant.currentTile || 0}</td>
                <td>${applicant.videoURL ? `<a href="${applicant.videoURL}" target="_blank">View Video</a>` : 'N/A'}</td>
                <td class="actions">${actionsHtml}</td>
            `;

            applicantListBody.appendChild(row);
        });
    }

    async function handleStatusUpdate(email, newStatus) {
        try {
            const response = await fetch(UPDATE_STATUS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, status: newStatus }),
            });

            if (response.ok) {
                loadApplicants(); // Refresh the list
            } else {
                const result = await response.json();
                alert(result.message || "Failed to update status.");
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Could not connect to the n8n webhook to update status.");
        }
    }

    applicantListBody.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON' && target.dataset.email) {
            const { email, status } = target.dataset;
            if (confirm(`Are you sure you want to set status to '${status}' for ${email}?`)) {
                handleStatusUpdate(email, status);
            }
        }
    });

    loadApplicants();
});
