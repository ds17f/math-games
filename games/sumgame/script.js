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
        updateHighScoreDisplay(); // Update high score display for new settings
    });
    
    targetSlider.addEventListener('input', () => {
        targetNumber = parseInt(targetSlider.value);
        targetValue.textContent = targetNumber;
        targetNumberDisplay.textContent = targetNumber;
        saveSettings();
        updateHighScoreDisplay(); // Update high score display for new settings
        
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
        
        // Update high score display for new settings
        updateHighScoreDisplay();
        
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
    
    // Clear selection class but don't affect circles being processed
    clearSelectionClass();
    
    // Add this circle to selection
    const circle = e.target;
    if (circle.classList.contains('circle')) {
        // Only select if the circle isn't currently in a fading state
        if (!circle.classList.contains('fading')) {
            circle.classList.add('selected');
            selectedCircles.push(circle);
            currentSum += parseInt(circle.textContent);
            updateCurrentSumDisplay();
            lastTouchedCircle = circle;
        }
    }
}

// Continue dragging over other circles
function continueDrag(e) {
    if (!gameActive || !isDragging) return;
    
    const circle = e.target;
    
    // Only select if it's a circle, not already selected, and not fading
    if (circle.classList.contains('circle') && 
        !selectedCircles.includes(circle) && 
        !circle.classList.contains('fading')) {
        
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
        // Don't select circles that are in transition
        if (circle.classList.contains('fading')) {
            return;
        }
        
        isDragging = true;
        selectedCircles = [];
        currentSum = 0;
        
        // Clear selection class but don't affect circles being processed
        clearSelectionClass();
        
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
    
    if (circle && 
        circle.classList.contains('circle') && 
        !selectedCircles.includes(circle) && 
        !circle.classList.contains('fading')) {
        
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
    
    // Create a local copy of the current selection
    const currentSelection = [...selectedCircles];
    const currentSelectionSum = currentSum;
    
    // Clear the global selection state to allow new selections immediately
    selectedCircles = [];
    currentSum = 0;
    updateCurrentSumDisplay();
    
    // Check if sum matches target
    if (currentSelectionSum === targetNumber) {
        handleCorrectSum(currentSelection);
    } else {
        handleIncorrectSum(currentSelection);
    }
    
    // Ensure touch events don't affect anything else
    if (e && e.type === 'touchend' && e.target.closest('.grid-container')) {
        e.preventDefault();
    }
}

// Clear all selection classes
function clearSelectionClass() {
    const circles = document.querySelectorAll('.circle.selected');
    circles.forEach(circle => {
        circle.classList.remove('selected');
    });
}

// Clear all selection states
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
function handleCorrectSum(circlesToHandle) {
    // Visual feedback
    circlesToHandle.forEach(circle => {
        circle.classList.add('correct');
        circle.classList.remove('selected');
    });
    
    // Mark each circle with a unique ID to track it through the replacement process
    const processId = Date.now() + '-' + Math.floor(Math.random() * 1000);
    circlesToHandle.forEach(circle => {
        circle.dataset.processId = processId;
    });
    
    // Update score
    currentScore++;
    scoreDisplay.textContent = currentScore;
    
    // Wait a moment to show the correct state
    setTimeout(() => {
        // Find the circles that are still in the DOM with our process ID
        const circlesStillInDom = [];
        circlesToHandle.forEach(circle => {
            // Verify the circle is still in the DOM and has our process ID
            if (document.body.contains(circle) && circle.dataset.processId === processId) {
                circlesStillInDom.push(circle);
                circle.classList.add('fading');
            }
        });
        
        // Wait for the fade animation to complete before replacing
        setTimeout(() => {
            replaceCircles(circlesStillInDom, processId);
        }, 500); // Match this timing with the CSS transition duration
    }, 500);
}

// Handle incorrect sum
function handleIncorrectSum(circlesToHandle) {
    // Mark circles with a unique process ID
    const processId = Date.now() + '-' + Math.floor(Math.random() * 1000);
    circlesToHandle.forEach(circle => {
        circle.dataset.processId = processId;
        circle.classList.add('incorrect');
        circle.classList.remove('selected');
    });
    
    // Reset after a moment
    setTimeout(() => {
        // Find circles that still have our process ID
        circlesToHandle.forEach(circle => {
            if (document.body.contains(circle) && circle.dataset.processId === processId) {
                circle.classList.remove('incorrect');
                // Remove the process ID
                delete circle.dataset.processId;
            }
        });
    }, 500);
}

// Replace circles with new ones
function replaceCircles(circlesToReplace, processId) {
    // Make sure we have valid circles to replace
    if (!circlesToReplace.length) return;
    
    // Get all current circles to read their values
    const allCircles = document.querySelectorAll('.circle');
    const currentGridNumbers = Array.from(allCircles).map(circle => parseInt(circle.textContent));
    
    // Get indices of circles to replace, filtering out invalid ones
    const replaceIndices = [];
    const validCircles = [];
    
    circlesToReplace.forEach(circle => {
        // Double-check the circle is still valid and matches our process ID
        if (document.body.contains(circle) && 
            circle.dataset.processId === processId &&
            !isNaN(parseInt(circle.dataset.index))) {
            
            replaceIndices.push(parseInt(circle.dataset.index));
            validCircles.push(circle);
        }
    });
    
    // Make sure we have valid indices to replace
    if (!replaceIndices.length) return;
    
    // Create new valid path that includes at least one of the replaced circles
    ensureValidPathExists(currentGridNumbers, replaceIndices);
    
    // Update the circles with new numbers
    validCircles.forEach((circle, i) => {
        const index = parseInt(circle.dataset.index);
        
        // Reset the circle's appearance
        circle.style.opacity = '0'; // Start invisible
        
        // Replace number and clear all classes
        circle.textContent = currentGridNumbers[index];
        circle.classList.remove('correct');
        circle.classList.remove('incorrect');
        circle.classList.remove('selected');
        circle.classList.remove('fading');
        
        // Remove the process ID
        delete circle.dataset.processId;
        
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

// Get current configuration
function getCurrentConfig() {
    return {
        targetNumber: targetNumber,
        gridSize: gridSize,
        timeLimit: timerMinutes
    };
}

// Get current high score for this configuration
function getHighScore() {
    const config = getCurrentConfig();
    
    console.log('Getting high score for config:', config);
    
    // Try to get high score from parent ScoreManager first
    if (window.parent && window.parent.ScoreManager) {
        console.log('Using parent ScoreManager to get score');
        const score = window.parent.ScoreManager.getScore('sumgame', config) || 0;
        console.log('Score from ScoreManager:', score);
        return score;
    } else {
        // Fallback to localStorage with a simple key format
        console.log('Parent ScoreManager not available, using localStorage fallback');
        
        // First try with the new key format (same as parent ScoreManager)
        const keyParent = 'sumGameHighScores';
        const keyConfig = `t${config.targetNumber}_g${config.gridSize}_m${config.timeLimit}`;
        
        console.log('Looking for score with parent key:', keyParent, 'and config key:', keyConfig);
        
        try {
            const scores = JSON.parse(localStorage.getItem(keyParent) || '{}');
            if (scores[keyConfig] && scores[keyConfig].score) {
                console.log('Found score in parent format:', scores[keyConfig].score);
                return scores[keyConfig].score;
            }
        } catch (e) {
            console.log('Error parsing parent format scores:', e);
        }
        
        // Fall back to the old format if the new format isn't found
        const key = `sumGameHighScore_t${config.targetNumber}_g${config.gridSize}_m${config.timeLimit}`;
        const score = parseInt(localStorage.getItem(key) || '0');
        console.log('Score from legacy localStorage format:', score, 'for key:', key);
        return score;
    }
}

// Get high score text for display
function getHighScoreText() {
    const highScore = getHighScore();
    const config = getCurrentConfig();
    
    if (highScore > 0) {
        return `${highScore} (for current settings)`;
    } else {
        return '0';
    }
}

// Update high score display
function updateHighScoreDisplay() {
    highScoreDisplay.textContent = getHighScoreText();
}

// Save high score to localStorage using the ScoreManager if available
function saveHighScore() {
    const config = getCurrentConfig();
    let scoreUpdated = false;
    
    console.log('Saving high score:', currentScore, 'with config:', config);
    
    // Check if ScoreManager exists (available from parent window)
    if (window.parent && window.parent.ScoreManager) {
        // Use ScoreManager from the parent window
        console.log('Using parent ScoreManager to save score');
        scoreUpdated = window.parent.ScoreManager.setScore('sumgame', currentScore, config);
        console.log('Score updated?', scoreUpdated);
    } else {
        // Fallback to local storage if ScoreManager is not available
        console.log('Parent ScoreManager not available, using localStorage fallback');
        
        // Use the same storage format as the parent ScoreManager for consistency
        const keyParent = 'sumGameHighScores';
        const keyConfig = `t${config.targetNumber}_g${config.gridSize}_m${config.timeLimit}`;
        
        try {
            // Get existing scores or initialize new object
            const scores = JSON.parse(localStorage.getItem(keyParent) || '{}');
            const existingScore = scores[keyConfig] && scores[keyConfig].score ? scores[keyConfig].score : 0;
            
            console.log('Current high score for', keyConfig, ':', existingScore);
            
            if (currentScore > existingScore) {
                // Update score in the same format as ScoreManager uses
                scores[keyConfig] = {
                    score: currentScore,
                    config: config,
                    timestamp: new Date().toISOString()
                };
                
                localStorage.setItem(keyParent, JSON.stringify(scores));
                scoreUpdated = true;
                console.log('Updated high score in localStorage with new format');
            }
        } catch (e) {
            // Fallback to the old format if there's an error
            console.log('Error with new format, falling back to legacy format:', e);
            
            const key = `sumGameHighScore_t${config.targetNumber}_g${config.gridSize}_m${config.timeLimit}`;
            const highScore = localStorage.getItem(key) || 0;
            
            if (currentScore > parseInt(highScore)) {
                localStorage.setItem(key, currentScore.toString());
                scoreUpdated = true;
                console.log('Updated high score in localStorage with legacy format');
            }
        }
    }
    
    // Show message if high score was updated
    if (scoreUpdated) {
        alert(`New High Score for current settings: ${currentScore}!`);
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