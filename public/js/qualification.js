document.addEventListener('DOMContentLoaded', () => {
    const boardGrid = document.querySelector('.board-grid');
    const currentTileSpan = document.getElementById('current-tile');
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const rollStatus = document.querySelector('.roll-status');

    const TOTAL_TILES = 49;
    let currentPlayerPosition = 1; // Start at tile 1

    // --- Game State Initialization ---
    function initializeGame() {
        // Load state from localStorage or default
        const savedPosition = parseInt(localStorage.getItem('currentPlayerPosition')) || 1;
        currentPlayerPosition = savedPosition;

        renderBoard();
        updatePlayerUI();
        checkRollCooldown();
    }

    // --- Board Rendering ---
    function renderBoard() {
        boardGrid.innerHTML = ''; // Clear existing board
        for (let i = 1; i <= TOTAL_TILES; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.tileNumber = i;
            tile.textContent = i;

            // Add checkpoint styling
            if ([10, 21, 30, 43].includes(i)) {
                tile.classList.add('checkpoint');
            }

            boardGrid.appendChild(tile);
        }
    }

    // --- Player UI Update ---
    function updatePlayerUI() {
        currentTileSpan.textContent = currentPlayerPosition;

        // Update active tile highlight
        document.querySelectorAll('.tile').forEach(tile => {
            tile.classList.remove('active');
            if (parseInt(tile.dataset.tileNumber) === currentPlayerPosition) {
                tile.classList.add('active');
            }
        });
    }

    // --- Dice Roll Logic ---
    function rollDice() {
        const rollResult = Math.floor(Math.random() * 6) + 1;
        movePlayer(rollResult);

        // Set cooldown
        const now = new Date().getTime();
        localStorage.setItem('lastRollTimestamp', now);

        checkRollCooldown();
        handleCheckpoints();
    }

    function movePlayer(steps) {
        let newPosition = currentPlayerPosition + steps;
        if (newPosition > TOTAL_TILES) {
            newPosition = TOTAL_TILES; // Cap at the final tile
        }
        currentPlayerPosition = newPosition;
        localStorage.setItem('currentPlayerPosition', currentPlayerPosition);
        updatePlayerUI();
    }

    // --- Cooldown Logic ---
    function checkRollCooldown() {
        const lastRollTimestamp = localStorage.getItem('lastRollTimestamp');
        if (!lastRollTimestamp) {
            rollDiceBtn.disabled = false;
            rollStatus.textContent = "You may roll the dice.";
            return;
        }

        const now = new Date().getTime();
        const timeSinceLastRoll = now - parseInt(lastRollTimestamp);
        const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours

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

    // --- Checkpoint Handler ---
    function handleCheckpoints() {
        const currentTile = currentPlayerPosition;

        if (currentTile === 30) {
            // Redirect to the upload page
            alert("Checkpoint Reached: Tile 30! You must now submit your final video.");
            window.location.href = '/upload.html';
        } else if ([10, 21, 43].includes(currentTile)) {
            // Placeholder for other checkpoints
            alert(`Checkpoint Reached: Tile ${currentTile}! Your progress has been noted.`);
        }

        if(currentTile === 49){
            alert("Congratulations! You have reached the final tile.");
            rollDiceBtn.disabled = true;
            rollStatus.textContent = "Qualification Complete. Awaiting final decision.";
        }
    }

    // --- Event Listeners ---
    rollDiceBtn.addEventListener('click', rollDice);

    // --- Initial Load ---
    initializeGame();
});
