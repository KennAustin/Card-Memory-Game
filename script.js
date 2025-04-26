document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameBoard = document.getElementById('game-board');
    const timerDisplay = document.getElementById('timer');
    const movesDisplay = document.getElementById('moves');
    const matchesDisplay = document.getElementById('matches');
    const difficultySelect = document.getElementById('difficulty');
    const newGameBtn = document.getElementById('new-game');
    const playAgainBtn = document.getElementById('play-again');
    const winModal = document.getElementById('win-modal');
    const finalTimeDisplay = document.getElementById('final-time');
    const finalMovesDisplay = document.getElementById('final-moves');

    // Game variables
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer = null;
    let seconds = 0;
    let totalPairs = 0;
    let gameActive = false;

    // Emoji sets for different difficulties
    const emojiSets = {
        easy: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
        medium: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦'],
        hard: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷']
    };

    // Initialize game
    function initGame() {
        stopTimer();
        const difficulty = difficultySelect.value;
        let pairsNeeded = 0;
        let gridSize = 0;
        
        // Set game parameters based on difficulty
        switch(difficulty) {
            case 'easy':
                pairsNeeded = 8;
                gridSize = 4;
                break;
            case 'medium':
                pairsNeeded = 18;
                gridSize = 6;
                break;
            case 'hard':
                pairsNeeded = 32;
                gridSize = 8;
                break;
        }
    
        // Get emojis for current difficulty
        const emojis = emojiSets[difficulty].slice(0, pairsNeeded);
        
        // Create card pairs
        cards = [...emojis, ...emojis];
        totalPairs = pairsNeeded;
        
        // Set grid size
        gameBoard.dataset.difficulty = difficulty;
        gameBoard.style.setProperty('--grid-size', gridSize);
        
        shuffleCards();
        createBoard();
        resetGameStats();
        gameActive = true;
        startTimer();
    }

// Update the timer functions:
function startTimer() {
    seconds = 0;
    clearInterval(timer); // Clear any existing timer
    updateTimerDisplay();
    timer = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

    // Shuffle cards using Fisher-Yates algorithm
    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    // Create game board
    function createBoard() {
        gameBoard.innerHTML = '';
        
        // Calculate needed cards based on difficulty
        const difficulty = gameBoard.dataset.difficulty;
        const gridSize = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
        const totalCards = gridSize * gridSize;
        
        // Create cards (with empty cards if needed for perfect grid)
        for (let i = 0; i < totalCards; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            
            if (i < cards.length) {
                card.dataset.index = i;
                card.dataset.value = cards[i];
                card.addEventListener('click', flipCard);
            } else {
                // Empty card to fill grid
                card.classList.add('empty');
            }
            
            gameBoard.appendChild(card);
        }
    }

    // Flip card
    function flipCard() {
        if (!gameActive || this.classList.contains('flipped') || this.classList.contains('matched')) return;

        // Don't allow more than 2 cards flipped
        if (flippedCards.length === 2) return;

        this.classList.add('flipped');
        this.textContent = this.dataset.value;
        flippedCards.push(this);

        // Check for match when two cards are flipped
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkForMatch();
        }
    }

    // Check for match
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.value === card2.dataset.value;

        if (isMatch) {
            handleMatch();
        } else {
            unflipCards();
        }
    }

    function handleMatch() {
        flippedCards.forEach(card => {
            card.classList.add('matched');
            card.removeEventListener('click', flipCard);
        });

        matchedPairs++;
        matchesDisplay.textContent = matchedPairs;
        flippedCards = [];

        // Check for win
        if (matchedPairs === totalPairs) {
            endGame();
        }
    }

    function unflipCards() {
        setTimeout(() => {
            flippedCards.forEach(card => {
                card.classList.remove('flipped');
                card.textContent = '';
            });
            flippedCards = [];
        }, 1000);
    }

    // Timer functions
    function startTimer() {
        seconds = 0;
        updateTimerDisplay();
        timer = setInterval(() => {
            seconds++;
            updateTimerDisplay();
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function stopTimer() {
        clearInterval(timer);
    }

    // Game control functions
    function resetGameStats() {
        moves = 0;
        matchedPairs = 0;
        seconds = 0;
        flippedCards = [];
        movesDisplay.textContent = '0';
        matchesDisplay.textContent = '0';
        timerDisplay.textContent = '00:00';
    }

    function endGame() {
        gameActive = false;
        stopTimer();
        finalTimeDisplay.textContent = timerDisplay.textContent;
        finalMovesDisplay.textContent = moves;
        winModal.style.display = 'flex';
    }

    // Event listeners
    newGameBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', () => {
        winModal.style.display = 'none';
        initGame();
    });

    // Start initial game
    initGame();
});