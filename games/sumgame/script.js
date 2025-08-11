// DOM Elements
const gridContainer = document.getElementById('grid-container');
const targetNumberDisplay = document.getElementById('target-number');
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');
const highScoreDisplay = document.getElementById('high-score');
const currentSumDisplay = document.getElementById('current-sum');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const timerSlider = document.getElementById('timer-slider');
const timerValue = document.getElementById('timer-value');
const targetSlider = document.getElementById('target-slider');
const targetValue = document.getElementById('target-value');
const gridSizeSlider = document.getElementById('grid-size-slider');
const gridSizeValue = document.getElementById('grid-size-value');

// Game Variables
let targetNumber = 9;
let currentScore = 0;
let gameActive = false;
let timerMinutes = 2;
let timerSeconds = timerMinutes * 60;
let gameInterval;
let selectedCircles = [];
let currentSum = 0;
let gridSize = 6; // Default grid size (6x6)
let isDragging = false;
let lastTouchedCircle = null;

// Initialize game settings
function initializeSettings() {
    // Update settings displays
    timerValue.textContent = timerMinutes;
    targetValue.textContent = targetNumber;
    gridSizeValue.textContent = `${gridSize}x${gridSize}`;
    
    // Update timer display
    updateTimerDisplay();
    
    // Event listeners for sliders
    timerSlider.addEventListener('input', () => {
        timerMinutes = parseInt(timerSlider.value);
        timerValue.textContent = timerMinutes;
        timerSeconds = timerMinutes * 60;
        updateTimerDisplay();
        saveSettings();
    });
    
    targetSlider.addEventListener('input', () => {
        targetNumber = parseInt(targetSlider.value);
        targetValue.textContent = targetNumber;
        targetNumberDisplay.textContent = targetNumber;
        saveSettings();
        
        // Regenerate grid if game is not active
        if (!gameActive) {
            createGrid();
        }
    });
    
    gridSizeSlider.addEventListener('input', () => {
        gridSize = parseInt(gridSizeSlider.value);
        gridSizeValue.textContent = `${gridSize}x${gridSize}`;
        
        // Update grid layout
        updateGridLayout();
        
        // Save settings
        saveSettings();
        
        // Regenerate grid if game is not active
        if (!gameActive) {
            createGrid();
        }
    });
}

// Update grid layout based on grid size
function updateGridLayout() {
    // Update grid-template-columns and grid-template-rows CSS properties
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    
    // Adjust the gap size based on the grid size for better spacing
    // Smaller grids get larger gaps, larger grids get smaller gaps
    const gapSize = Math.max(4, 15 - gridSize * 1.5); // Dynamic gap calculation
    gridContainer.style.gap = `${gapSize}px`;
}

// Create grid of numbered circles
function createGrid() {
    // Clear the grid
    gridContainer.innerHTML = '';
    
    // Generate the grid numbers with guaranteed path to target
    const gridNumbers = generateGridWithValidPath();
    
    // Create circles with the generated numbers
    for (let i = 0; i < gridSize * gridSize; i++) {
        const circle = document.createElement('div');
        circle.className = 'circle';
        circle.dataset.index = i;
        
        circle.textContent = gridNumbers[i];
        
        // Only add mouse events to individual circles (better performance)
        circle.addEventListener('mousedown', startDrag);
        circle.addEventListener('mouseover', continueDrag);
        
        gridContainer.appendChild(circle);
    }
    
    // Remove existing touch listeners if any (prevents duplicate listeners)
    gridContainer.removeEventListener('touchstart', handleTouch);
    gridContainer.removeEventListener('touchmove', handleTouchMove);
    
    // Add touch events to the grid container only (better touch handling)
    gridContainer.addEventListener('touchstart', handleTouch, { passive: false });
    gridContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Global events to end dragging
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
}

// Generate grid numbers with at least one valid path to the target number
function generateGridWithValidPath() {
    const totalCells = gridSize * gridSize;
    let gridNumbers = [];
    
    // First, fill the grid with random numbers
    for (let i = 0; i < totalCells; i++) {
        // Generate random number between 1 and (targetNumber - 1)
        const randomNumber = Math.floor(Math.random() * (targetNumber - 1)) + 1;
        gridNumbers.push(randomNumber);
    }
    
    // Create a valid path by selecting 2-4 numbers that sum to the target
    const pathLength = Math.floor(Math.random() * 3) + 2; // 2 to 4 numbers
    let pathSum = 0;
    const pathIndices = [];
    
    // Select random positions for our path
    while (pathIndices.length < pathLength) {
        const randomIndex = Math.floor(Math.random() * totalCells);
        if (!pathIndices.includes(randomIndex)) {
            pathIndices.push(randomIndex);
        }
    }
    
    // Reset the sum for these positions
    for (let i = 0; i < pathIndices.length - 1; i++) {
        const cellIndex = pathIndices[i];
        // Assign numbers between 1 and targetNumber-1, ensuring they're not too large
        const maxValue = Math.min(targetNumber - 1, targetNumber - pathSum - (pathLength - i - 1));
        const value = Math.floor(Math.random() * maxValue) + 1;
        gridNumbers[cellIndex] = value;
        pathSum += value;
    }
    
    // The last number must complete the path to the target
    const lastCellIndex = pathIndices[pathIndices.length - 1];
    gridNumbers[lastCellIndex] = targetNumber - pathSum;
    
    return gridNumbers;
}

// Start dragging
function startDrag(e) {
    if (!gameActive) return;
    
    isDragging = true;
    selectedCircles = [];
    currentSum = 0;
    
    // Clear any previously selected circles
    clearSelection();
    
    // Add this circle to selection
    const circle = e.target;
    if (circle.classList.contains('circle')) {
        circle.classList.add('selected');
        selectedCircles.push(circle);
        currentSum += parseInt(circle.textContent);
        updateCurrentSumDisplay();
        lastTouchedCircle = circle;
    }
}

// Continue dragging over other circles
function continueDrag(e) {
    if (!gameActive || !isDragging) return;
    
    const circle = e.target;
    
    // Only select if it's a circle and not already selected
    if (circle.classList.contains('circle') && !selectedCircles.includes(circle)) {
        circle.classList.add('selected');
        selectedCircles.push(circle);
        currentSum += parseInt(circle.textContent);
        updateCurrentSumDisplay();
        lastTouchedCircle = circle;
    }
}

// Handle touch events for mobile
function handleTouch(e) {
    // Only prevent default within the grid container itself
    if (e.target.closest('.grid-container')) {
        e.preventDefault(); // Prevent scrolling only inside the grid
    } else {
        return; // Exit if touch is outside the grid
    }
    
    if (!gameActive) return;
    
    const touch = e.touches[0];
    const circle = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (circle && circle.classList.contains('circle')) {
        isDragging = true;
        selectedCircles = [];
        currentSum = 0;
        
        // Clear any previously selected circles
        clearSelection();
        
        // Add this circle to selection
        circle.classList.add('selected');
        selectedCircles.push(circle);
        currentSum += parseInt(circle.textContent);
        updateCurrentSumDisplay();
        lastTouchedCircle = circle;
    }
}

// Handle touch move for mobile
function handleTouchMove(e) {
    // Only prevent default within the grid container
    if (!e.target.closest('.grid-container')) {
        return; // Exit if touch is outside the grid
    }
    
    e.preventDefault(); // Prevent scrolling
    
    if (!gameActive || !isDragging) return;
    
    const touch = e.touches[0];
    const circle = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (circle && circle.classList.contains('circle') && !selectedCircles.includes(circle)) {
        circle.classList.add('selected');
        selectedCircles.push(circle);
        currentSum += parseInt(circle.textContent);
        updateCurrentSumDisplay();
        lastTouchedCircle = circle;
    }
}

// End dragging and check sum
function endDrag(e) {
    // Always reset dragging state regardless of game state
    // This prevents "stuck" dragging states
    const wasDragging = isDragging;
    isDragging = false;
    
    if (!gameActive || !wasDragging) return;
    
    // Check if sum matches target
    if (currentSum === targetNumber) {
        handleCorrectSum();
    } else {
        handleIncorrectSum();
    }
    
    // Ensure touch events don't affect anything else
    if (e && e.type === 'touchend' && e.target.closest('.grid-container')) {
        e.preventDefault();
    }
}

// Clear selection
function clearSelection() {
    const circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
        circle.classList.remove('selected');
        circle.classList.remove('correct');
        circle.classList.remove('incorrect');
    });
}

// Update current sum display
function updateCurrentSumDisplay() {
    currentSumDisplay.textContent = `Drag to Sum: ${currentSum}`;
}

// Handle correct sum
function handleCorrectSum() {
    // Visual feedback
    selectedCircles.forEach(circle => {
        circle.classList.add('correct');
        circle.classList.remove('selected');
    });
    
    // Update score
    currentScore++;
    scoreDisplay.textContent = currentScore;
    
    // Wait a moment to show the correct state
    setTimeout(() => {
        // Add fading animation
        selectedCircles.forEach(circle => {
            circle.classList.add('fading');
        });
        
        // Wait for the fade animation to complete before replacing
        setTimeout(() => {
            replaceCircles(selectedCircles);
            currentSum = 0;
            updateCurrentSumDisplay();
        }, 500); // Match this timing with the CSS transition duration
    }, 500);
}

// Handle incorrect sum
function handleIncorrectSum() {
    // Visual feedback
    selectedCircles.forEach(circle => {
        circle.classList.add('incorrect');
        circle.classList.remove('selected');
    });
    
    // Reset after a moment
    setTimeout(() => {
        clearSelection();
        currentSum = 0;
        updateCurrentSumDisplay();
    }, 500);
}

// Replace circles with new ones
function replaceCircles(circlesToReplace) {
    const allCircles = document.querySelectorAll('.circle');
    const currentGridNumbers = Array.from(allCircles).map(circle => parseInt(circle.textContent));
    
    // Get indices of circles to replace
    const replaceIndices = Array.from(circlesToReplace).map(circle => 
        parseInt(circle.dataset.index)
    );
    
    // Create new valid path that includes at least one of the replaced circles
    ensureValidPathExists(currentGridNumbers, replaceIndices);
    
    // Update the circles with new numbers
    circlesToReplace.forEach((circle, i) => {
        const index = parseInt(circle.dataset.index);
        
        // Reset the circle's appearance
        circle.style.opacity = '0'; // Start invisible
        
        // Replace number and clear all classes
        circle.textContent = currentGridNumbers[index];
        circle.classList.remove('correct');
        circle.classList.remove('incorrect');
        circle.classList.remove('selected');
        circle.classList.remove('fading');
        
        // Force a reflow to make the transition work
        void circle.offsetWidth;
        
        // Fade the circle back in with a slight delay for each circle
        setTimeout(() => {
            circle.style.opacity = '1';
        }, i * 50); // Stagger the fade-in of each circle
    });
}

// Ensure there is a valid path with the replaced circles
function ensureValidPathExists(gridNumbers, replaceIndices) {
    // Check if we already have a valid path without modifying the replaced circles
    if (hasValidPath(gridNumbers, replaceIndices)) {
        // If so, just assign random numbers to replaced circles
        replaceIndices.forEach(index => {
            gridNumbers[index] = Math.floor(Math.random() * (targetNumber - 1)) + 1;
        });
        return;
    }
    
    // Otherwise, create a new valid path using at least one replaced circle
    
    // Decide how many replaced circles to use in the new path (at least 1)
    const useCount = Math.min(Math.floor(Math.random() * replaceIndices.length) + 1, replaceIndices.length);
    
    // Select which ones to use
    const selectedIndices = [];
    while (selectedIndices.length < useCount) {
        const randomIndex = replaceIndices[Math.floor(Math.random() * replaceIndices.length)];
        if (!selectedIndices.includes(randomIndex)) {
            selectedIndices.push(randomIndex);
        }
    }
    
    // Add some non-replaced circles to complete the path
    const remainingCircles = [];
    for (let i = 0; i < gridNumbers.length; i++) {
        if (!replaceIndices.includes(i)) {
            remainingCircles.push(i);
        }
    }
    
    // Shuffle remaining circles
    shuffleArray(remainingCircles);
    
    // Add 1-2 non-replaced circles to the path
    const additionalCount = Math.min(Math.floor(Math.random() * 2) + 1, remainingCircles.length);
    for (let i = 0; i < additionalCount; i++) {
        selectedIndices.push(remainingCircles[i]);
    }
    
    // Now create the path with the selected indices
    let pathSum = 0;
    
    // Assign values to all but the last circle in the path
    for (let i = 0; i < selectedIndices.length - 1; i++) {
        const index = selectedIndices[i];
        const maxValue = Math.min(targetNumber - 1, targetNumber - pathSum - (selectedIndices.length - i - 1));
        const value = Math.max(1, Math.floor(Math.random() * maxValue) + 1);
        gridNumbers[index] = value;
        pathSum += value;
    }
    
    // The last circle completes the path
    const lastIndex = selectedIndices[selectedIndices.length - 1];
    gridNumbers[lastIndex] = targetNumber - pathSum;
    
    // Assign random values to any remaining replaced circles not used in the path
    replaceIndices.forEach(index => {
        if (!selectedIndices.includes(index)) {
            gridNumbers[index] = Math.floor(Math.random() * (targetNumber - 1)) + 1;
        }
    });
}

// Check if the grid already has a valid path without modifying replaced circles
function hasValidPath(gridNumbers, excludeIndices) {
    // This is a simplified check - we'd need a more complex algorithm to exhaustively check
    // For now, we'll just create a new path each time
    return false;
}

// Shuffle array in place (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Start the game
function startGame() {
    // Reset game state
    gameActive = true;
    currentScore = 0;
    scoreDisplay.textContent = currentScore;
    timerSeconds = timerMinutes * 60;
    
    // Disable settings during game
    disableSettings(true);
    
    // Create the grid
    createGrid();
    
    // Update button states
    startBtn.textContent = "Game Running";
    startBtn.disabled = true;
    
    // Start the timer
    gameInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        
        if (timerSeconds <= 0) {
            endGame();
        }
    }, 1000);
}

// End the game
function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    
    // Enable settings again
    disableSettings(false);
    
    // Update button states
    startBtn.textContent = "Start Game";
    startBtn.disabled = false;
    
    // Show game over message
    alert(`Game Over! Your score: ${currentScore}`);
    
    // Save high score if it's higher than previous
    saveHighScore();
}

// Reset the game
function resetGame() {
    // End current game if active
    if (gameActive) {
        clearInterval(gameInterval);
        gameActive = false;
    }
    
    // Reset variables
    currentScore = 0;
    scoreDisplay.textContent = currentScore;
    timerSeconds = timerMinutes * 60;
    updateTimerDisplay();
    currentSum = 0;
    updateCurrentSumDisplay();
    
    // Enable settings
    disableSettings(false);
    
    // Reset button states
    startBtn.textContent = "Start Game";
    startBtn.disabled = false;
    
    // Clear selection
    clearSelection();
    
    // Create new grid
    createGrid();
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    timeLeftDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Disable/enable settings during game
function disableSettings(disabled) {
    timerSlider.disabled = disabled;
    targetSlider.disabled = disabled;
    gridSizeSlider.disabled = disabled;
}

// Get current high score
function getHighScore() {
    // Try to get high score from parent ScoreManager first
    if (window.parent && window.parent.ScoreManager) {
        return window.parent.ScoreManager.getScore('sumgame') || 0;
    } else {
        // Fallback to localStorage
        return parseInt(localStorage.getItem('sumGameHighScore') || '0');
    }
}

// Update high score display
function updateHighScoreDisplay() {
    const highScore = getHighScore();
    highScoreDisplay.textContent = highScore;
}

// Save high score to localStorage using the ScoreManager if available
function saveHighScore() {
    // Check if ScoreManager exists (available from parent window)
    if (window.parent && window.parent.ScoreManager) {
        // Use ScoreManager from the parent window
        const scoreUpdated = window.parent.ScoreManager.setScore('sumgame', currentScore);
        if (scoreUpdated) {
            alert(`New High Score: ${currentScore}!`);
        }
    } else {
        // Fallback to local storage if ScoreManager is not available
        const highScore = localStorage.getItem('sumGameHighScore') || 0;
        
        if (currentScore > parseInt(highScore)) {
            localStorage.setItem('sumGameHighScore', currentScore);
            alert(`New High Score: ${currentScore}!`);
        }
    }
    
    // Update the high score display
    updateHighScoreDisplay();
}

// Initialize the game
function init() {
    initializeSettings();
    updateGridLayout(); // Set initial grid layout
    createGrid();
    
    // Update high score display
    updateHighScoreDisplay();
    
    // Add button event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    
    // Save settings to localStorage
    saveSettings();
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('sumGameSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        timerMinutes = settings.timerMinutes || 2;
        timerSlider.value = timerMinutes;
        timerValue.textContent = timerMinutes;
        
        targetNumber = settings.targetNumber || 9;
        targetSlider.value = targetNumber;
        targetValue.textContent = targetNumber;
        targetNumberDisplay.textContent = targetNumber;
        
        gridSize = settings.gridSize || 4;
        gridSizeSlider.value = gridSize;
        gridSizeValue.textContent = `${gridSize}x${gridSize}`;
    }
}

// Save settings to localStorage
function saveSettings() {
    const settings = {
        timerMinutes,
        targetNumber,
        gridSize
    };
    localStorage.setItem('sumGameSettings', JSON.stringify(settings));
}

// Load game when page is ready
window.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    init();
});