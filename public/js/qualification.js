document.addEventListener('DOMContentLoaded', () => {
    const boardGrid = document.querySelector('.board-grid');
    const currentTileSpan = document.getElementById('current-tile');
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const rollStatus = document.querySelector('.roll-status');

    const TOTAL_TILES = 49;
    let currentPlayerPosition = 1;
    const userEmail = localStorage.getItem('userEmail');

    async function initializeGame() {
        if (!userEmail) {
            // For now, we'll let non-logged-in users play for testing.
            // In a real scenario, you'd want to redirect:
            // window.location.href = '/index.html';
            console.warn("No user email found in localStorage. Proceeding in anonymous mode.");
        }

        // Temporarily disabled until the get-applicants webhook is available
        /*
        try {
            // Placeholder for get-applicant-by-email webhook
            const response = await fetch(`https://amosyang.app.n8n.cloud/webhook/get-applicant?email=${userEmail}`);
            const currentUser = await response.json();

            if (currentUser) {
                currentPlayerPosition = currentUser.currentTile || 1;
                if(currentUser.status !== 'in-progress'){
                    rollDiceBtn.disabled = true;
                    rollStatus.textContent = "You are not currently in the qualification phase.";
                }
            }
        } catch (error) {
            console.error("Failed to fetch applicant data:", error);
        }
        */

        // For now, we'll pull the position from localStorage for testing continuity.
        currentPlayerPosition = parseInt(localStorage.getItem('currentPlayerPosition')) || 1;


        renderBoard();
        updatePlayerUI();
        checkRollCooldown();
    }

    function renderBoard() {
        boardGrid.innerHTML = '';
        for (let i = 1; i <= TOTAL_TILES; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.tileNumber = i;
            tile.textContent = i;
            if ([10, 21, 30, 43].includes(i)) tile.classList.add('checkpoint');
            boardGrid.appendChild(tile);
        }
    }

    function updatePlayerUI() {
        currentTileSpan.textContent = currentPlayerPosition;
        localStorage.setItem('currentPlayerPosition', currentPlayerPosition); // Keep track locally
        document.querySelectorAll('.tile').forEach(tile => {
            tile.classList.remove('active');
            if (parseInt(tile.dataset.tileNumber) === currentPlayerPosition) {
                tile.classList.add('active');
            }
        });
    }

    async function rollDice() {
        const rollResult = Math.floor(Math.random() * 6) + 1;

        if (!userEmail) {
            alert("You must submit an application first to save your progress.");
            // Fake the roll locally for anon users
            currentPlayerPosition += rollResult;
            if (currentPlayerPosition > TOTAL_TILES) currentPlayerPosition = TOTAL_TILES;
            updatePlayerUI();
            handleCheckpoints();
            return;
        }

        try {
            const response = await fetch('https://amosyang.app.n8n.cloud/webhook/dice-roll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, roll: rollResult }),
            });

            const data = await response.json();

            if (response.ok) {
                currentPlayerPosition = data.newPosition;
                updatePlayerUI();

                const now = new Date().getTime();
                localStorage.setItem('lastRollTimestamp', now);
                checkRollCooldown();
                handleCheckpoints();
            } else {
                alert(data.message || data.error || "An error occurred.");
            }
        } catch (error) {
            console.error("Dice roll failed:", error);
            alert("Could not connect to the server to roll the dice.");
        }
    }

    function checkRollCooldown() {
        const lastRollTimestamp = localStorage.getItem('lastRollTimestamp');
        if (!lastRollTimestamp) {
            rollDiceBtn.disabled = false;
            rollStatus.textContent = "You may roll the dice.";
            return;
        }

        const now = new Date().getTime();
        const timeSinceLastRoll = now - parseInt(lastRollTimestamp);
        const cooldownPeriod = 24 * 60 * 60 * 1000;

        if (timeSinceLastRoll < cooldownPeriod) {
            rollDiceBtn.disabled = true;
            const remainingTime = cooldownPeriod - timeSinceLastRoll;
            const hours = Math.floor(remainingTime / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            rollStatus.textContent = `Next roll available in ${hours}h ${minutes}m.`;
        } else {
            rollDiceBtn.disabled = false;
            rollStatus.textContent = "You may roll the dice.";
        }
    }

    function handleCheckpoints() {
        if (currentPlayerPosition === 30) {
            alert("Checkpoint Reached: Tile 30! You must now submit your final video.");
            window.location.href = '/upload.html';
        } else if ([10, 21, 43].includes(currentPlayerPosition)) {
            alert(`Checkpoint Reached: Tile ${currentPlayerPosition}! Your progress has been noted.`);
        }

        if(currentPlayerPosition >= 49){
            alert("Congratulations! You have reached the final tile.");
            rollDiceBtn.disabled = true;
            rollStatus.textContent = "Qualification Complete. Awaiting final decision.";
        }
    }

    rollDiceBtn.addEventListener('click', rollDice);
    initializeGame();
});
