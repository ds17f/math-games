// DOM Elements
const dotCard = document.getElementById('dot-card');
const nextBtn = document.getElementById('next-btn');
const showAgainBtn = document.getElementById('show-again-btn');
const timerSlider = document.getElementById('timer-slider');
const timerValue = document.getElementById('timer-value');
const timerDisplay = document.getElementById('timer-display');

// Variables
let currentCard = 0;
let timerSeconds = 2;
let timer;
let timerInterval;

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

// Get a random card between 1 and 10
function getRandomCard() {
    return Math.floor(Math.random() * 10) + 1;
}

// Show next card button (randomized)
nextBtn.addEventListener('click', () => {
    // Get a random card that's different from the current one
    let newCard;
    do {
        newCard = getRandomCard();
    } while (newCard === currentCard && currentCard !== 0);
    
    currentCard = newCard;
    createDotCard(currentCard);
    showCard();
});

// Show card again button
showAgainBtn.addEventListener('click', () => {
    if (currentCard > 0) {
        showCard();
    }
});

// Initialize with first card
nextBtn.click();