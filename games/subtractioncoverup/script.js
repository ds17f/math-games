class SubtractionCoverUpGame {
    constructor() {
        this.frameSize = 10;
        this.frameStates = new Array(this.frameSize).fill(false); // false = empty, true = filled
        this.initializeGame();
        this.bindEvents();
    }

    initializeGame() {
        this.createTenFrame();
    }

    createTenFrame() {
        const tenFrame = document.getElementById('ten-frame');
        tenFrame.innerHTML = '';

        // Always use 2 rows, calculate columns needed
        const cols = Math.ceil(this.frameSize / 2);
        
        tenFrame.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        tenFrame.style.gridTemplateRows = `repeat(2, 1fr)`;

        // Create cells with alternating top/bottom pattern
        for (let i = 0; i < this.frameSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'frame-cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => this.toggleCell(i));
            
            // Position cells alternating between top and bottom rows
            const colPosition = Math.floor(i / 2);
            const rowPosition = i % 2; // 0 for top row, 1 for bottom row
            
            cell.style.gridColumn = colPosition + 1;
            cell.style.gridRow = rowPosition + 1;
            
            tenFrame.appendChild(cell);
        }
    }

    toggleCell(index) {
        this.frameStates[index] = !this.frameStates[index];
        this.updateDisplay();
    }

    updateDisplay() {
        const cells = document.querySelectorAll('.frame-cell');
        cells.forEach((cell, index) => {
            if (this.frameStates[index]) {
                cell.classList.add('filled');
            } else {
                cell.classList.remove('filled');
            }
        });
    }



    clearAll() {
        this.frameStates.fill(false);
        this.updateDisplay();
    }


    showRandomNumber() {
        // Fill all cells first
        this.frameStates.fill(true);
        this.updateDisplay();
        
        // Generate a random number between 1 and frameSize-1
        const randomNumber = Math.floor(Math.random() * (this.frameSize - 1)) + 1;
        
        // Display the random number
        const randomDisplay = document.getElementById('random-display');
        randomDisplay.textContent = `Random Number: ${randomNumber}`;
        randomDisplay.style.display = 'block';
    }

    updateFrameSize(newSize) {
        this.frameSize = newSize;
        this.frameStates = new Array(this.frameSize).fill(false);
        this.createTenFrame();
        
        // Hide random display when frame size changes
        const randomDisplay = document.getElementById('random-display');
        randomDisplay.style.display = 'none';
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    bindEvents() {
        document.getElementById('clear-all-btn').addEventListener('click', () => this.clearAll());
        document.getElementById('random-btn').addEventListener('click', () => this.showRandomNumber());
        
        // Frame size slider
        const frameSizeSlider = document.getElementById('frame-size-slider');
        const frameSizeValue = document.getElementById('frame-size-value');
        
        frameSizeSlider.addEventListener('input', (e) => {
            const newSize = parseInt(e.target.value);
            frameSizeValue.textContent = newSize;
            this.updateFrameSize(newSize);
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SubtractionCoverUpGame();
});