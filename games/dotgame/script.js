// DOM Elements
const dotCard = document.getElementById('dot-card');
const nextBtn = document.getElementById('next-btn');
const showAgainBtn = document.getElementById('show-again-btn');
const correctBtn = document.getElementById('correct-btn');
const incorrectBtn = document.getElementById('incorrect-btn');
const resetBtn = document.getElementById('reset-btn');
const showProbBtn = document.getElementById('show-prob-btn');
const timerSlider = document.getElementById('timer-slider');
const timerValue = document.getElementById('timer-value');
const timerDisplay = document.getElementById('timer-display');
const probabilityDisplay = document.getElementById('probability-display');

// Variables
let currentCard = 0;
let timerSeconds = 2;
let timer;
let timerInterval;

// Card weights for biasing incorrect cards
// Higher weight = more likely to be selected
let cardWeights = {
    1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 
    6: 1, 7: 1, 8: 1, 9: 1, 10: 1
};

// Load saved weights from localStorage if available
loadCardWeights();

// Update timer value display when slider changes
timerSlider.addEventListener('input', () => {
    timerSeconds = parseInt(timerSlider.value);
    timerValue.textContent = timerSeconds;
});

// Dice-like pattern definitions
const dicePatterns = {
    1: [{ class: 'dot-1' }],
    2: [{ class: 'dot-2-1' }, { class: 'dot-2-2' }],
    3: [{ class: 'dot-3-1' }, { class: 'dot-3-2' }, { class: 'dot-3-3' }],
    4: [{ class: 'dot-4-1' }, { class: 'dot-4-2' }, { class: 'dot-4-3' }, { class: 'dot-4-4' }],
    5: [{ class: 'dot-5-1' }, { class: 'dot-5-2' }, { class: 'dot-5-3' }, { class: 'dot-5-4' }, { class: 'dot-5-5' }],
    6: [{ class: 'dot-6-1' }, { class: 'dot-6-2' }, { class: 'dot-6-3' }, { class: 'dot-6-4' }, { class: 'dot-6-5' }, { class: 'dot-6-6' }],
    7: [{ class: 'dot-7-1' }, { class: 'dot-7-2' }, { class: 'dot-7-3' }, { class: 'dot-7-4' }, { class: 'dot-7-5' }, { class: 'dot-7-6' }, { class: 'dot-7-7' }],
    8: [{ class: 'dot-8-1' }, { class: 'dot-8-2' }, { class: 'dot-8-3' }, { class: 'dot-8-4' }, { class: 'dot-8-5' }, { class: 'dot-8-6' }, { class: 'dot-8-7' }, { class: 'dot-8-8' }],
    9: [{ class: 'dot-9-1' }, { class: 'dot-9-2' }, { class: 'dot-9-3' }, { class: 'dot-9-4' }, { class: 'dot-9-5' }, { class: 'dot-9-6' }, { class: 'dot-9-7' }, { class: 'dot-9-8' }, { class: 'dot-9-9' }],
    10: [{ class: 'dot-10-1' }, { class: 'dot-10-2' }, { class: 'dot-10-3' }, { class: 'dot-10-4' }, { class: 'dot-10-5' }, { class: 'dot-10-6' }, { class: 'dot-10-7' }, { class: 'dot-10-8' }, { class: 'dot-10-9' }, { class: 'dot-10-10' }]
};

// Create dice-like dot card
function createDotCard(number) {
    // Clear previous dots
    dotCard.innerHTML = '';
    
    // Remove any previous pattern classes
    dotCard.className = 'dot-card';
    
    // Add specific pattern class if needed
    if (number === 10) {
        dotCard.classList.add('pattern-10');
    }
    
    // Create dots based on the dice pattern
    const pattern = dicePatterns[number];
    pattern.forEach((dot, index) => {
        const dotElement = document.createElement('div');
        dotElement.className = `dot ${dot.class}`;
        dotCard.appendChild(dotElement);
    });
}

// Show card with timer
function showCard() {
    clearTimeout(timer);
    clearInterval(timerInterval);
    
    // Show the card
    dotCard.classList.remove('hidden');
    
    // Set the timer
    let timeLeft = timerSeconds;
    timerDisplay.textContent = `${timeLeft}s`;
    
    // Start countdown
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = '';
        }
    }, 1000);
    
    // Hide card after timer expires
    timer = setTimeout(() => {
        dotCard.classList.add('hidden');
    }, timerSeconds * 1000);
}

// Get a random card with bias based on weights
function getWeightedRandomCard() {
    // Calculate total weight
    const totalWeight = Object.values(cardWeights).reduce((sum, weight) => sum + weight, 0);
    
    // Generate random number between 0 and total weight
    let randomWeight = Math.random() * totalWeight;
    
    // Find the card that corresponds to this random weight
    for (let card = 1; card <= 10; card++) {
        randomWeight -= cardWeights[card];
        if (randomWeight <= 0) {
            return card;
        }
    }
    
    // Fallback
    return Math.floor(Math.random() * 10) + 1;
}

// Get a random card between 1 and 10
function getRandomCard() {
    let newCard;
    do {
        newCard = getWeightedRandomCard();
    } while (newCard === currentCard && currentCard !== 0);
    
    return newCard;
}

// Decrease bias for current card
function decreaseBias() {
    if (currentCard > 0) {
        // Decrease weight (minimum 1)
        cardWeights[currentCard] = Math.max(1, cardWeights[currentCard] - 1);
        saveCardWeights();
    }
}

// Increase bias for current card
function increaseBias() {
    if (currentCard > 0) {
        // Increase weight (more chance to appear)
        cardWeights[currentCard] += 2;
        saveCardWeights();
    }
}

// Reset all weights back to 1
function resetWeights() {
    for (let i = 1; i <= 10; i++) {
        cardWeights[i] = 1;
    }
    saveCardWeights();
    alert('Progress has been reset. All cards now have equal probability.');
}

// Save card weights to localStorage
function saveCardWeights() {
    localStorage.setItem('dotCardWeights', JSON.stringify(cardWeights));
}

// Load card weights from localStorage
function loadCardWeights() {
    const savedWeights = localStorage.getItem('dotCardWeights');
    if (savedWeights) {
        cardWeights = JSON.parse(savedWeights);
    }
}

// Show next card button (randomized)
nextBtn.addEventListener('click', () => {
    currentCard = getRandomCard();
    createDotCard(currentCard);
    showCard();
});

// Show card again button
showAgainBtn.addEventListener('click', () => {
    if (currentCard > 0) {
        showCard();
    }
});

// Bias - button (decrease probability)
correctBtn.addEventListener('click', () => {
    decreaseBias();
    // No auto-next card as requested
});

// Bias + button (increase probability)
incorrectBtn.addEventListener('click', () => {
    increaseBias();
    // No auto-next card as requested
});

// Reset button
resetBtn.addEventListener('click', () => {
    resetWeights();
});

// Calculate and display probabilities for each card
function showProbabilities() {
    // Calculate total weight
    const totalWeight = Object.values(cardWeights).reduce((sum, weight) => sum + weight, 0);
    
    // Build HTML to display probabilities
    let probHTML = '<h3>Card Probabilities</h3><table>';
    probHTML += '<tr><th>Card</th><th>Weight</th><th>Probability</th></tr>';
    
    for (let card = 1; card <= 10; card++) {
        const weight = cardWeights[card];
        const probability = ((weight / totalWeight) * 100).toFixed(1);
        
        // Highlight current card
        const isCurrentCard = card === currentCard;
        const rowStyle = isCurrentCard ? 'background-color:#e0f7fa;font-weight:bold;' : '';
        
        probHTML += `<tr style="${rowStyle}"><td>${card}</td><td>${weight}</td><td>${probability}%</td></tr>`;
    }
    
    probHTML += '</table>';
    probabilityDisplay.innerHTML = probHTML;
    probabilityDisplay.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
        probabilityDisplay.style.display = 'none';
    }, 5000);
}

// Show probability button
showProbBtn.addEventListener('click', () => {
    showProbabilities();
});

// Initialize with first card
nextBtn.click();