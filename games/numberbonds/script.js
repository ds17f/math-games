class NumberBondsGame {
    constructor() {
        this.targetNumber = 10;
        this.knownAddend = 0;
        this.correctAnswer = 0;
        this.currentInput = '';
        this.score = 0;
        this.totalProblems = 0;
        this.minTarget = 5;
        this.maxTarget = 20;
        
        this.initializeGame();
        this.bindEvents();
    }

    initializeGame() {
        this.generateNewProblem();
        this.updateDisplay();
    }

    generateNewProblem() {
        // Generate random target number within bounds
        const range = this.maxTarget - this.minTarget + 1;
        this.targetNumber = Math.floor(Math.random() * range) + this.minTarget;
        
        // Generate random known addend (0 to target number)
        this.knownAddend = Math.floor(Math.random() * (this.targetNumber + 1));
        
        // Calculate correct answer
        this.correctAnswer = this.targetNumber - this.knownAddend;
        
        // Reset input
        this.currentInput = '';
        
        // Clear feedback
        this.clearFeedback();
        
        // Update display
        this.updateDisplay();
    }

    updateDisplay() {
        document.getElementById('target-number').textContent = this.targetNumber;
        document.getElementById('known-addend').textContent = this.knownAddend;
        document.getElementById('missing-addend').textContent = this.currentInput || '?';
        document.getElementById('score-display').textContent = `Score: ${this.score} / ${this.totalProblems}`;
    }

    handleKeyPress(number) {
        // Only allow single digit input for now
        if (this.currentInput.length < 2) {
            if (this.currentInput === '' && number === '0' && this.correctAnswer !== 0) {
                // Don't allow leading zeros unless the answer is 0
                return;
            }
            
            this.currentInput += number;
            this.updateDisplay();
        }
    }

    checkAnswer() {
        if (this.currentInput === '') return;
        
        const inputNumber = parseInt(this.currentInput);
        const feedback = document.getElementById('feedback');
        
        this.totalProblems++;
        
        if (inputNumber === this.correctAnswer) {
            this.score++;
            feedback.textContent = '✓ Correct! Great job!';
            feedback.className = 'feedback correct';
            
            // Auto-generate new problem after a short delay
            setTimeout(() => {
                this.generateNewProblem();
            }, 1500);
        } else {
            feedback.textContent = `✗ Not quite. ${this.knownAddend} + ${inputNumber} = ${this.knownAddend + inputNumber}, but we need ${this.targetNumber}.`;
            feedback.className = 'feedback incorrect';
        }
        
        this.updateDisplay();
    }

    clearInput() {
        this.currentInput = '';
        this.updateDisplay();
        this.clearFeedback();
    }

    clearFeedback() {
        const feedback = document.getElementById('feedback');
        feedback.textContent = '';
        feedback.className = 'feedback';
    }

    showHint() {
        const feedback = document.getElementById('feedback');
        feedback.textContent = `Hint: ${this.knownAddend} + ? = ${this.targetNumber}. What number do you add to ${this.knownAddend} to get ${this.targetNumber}?`;
        feedback.className = 'feedback';
    }

    bindEvents() {
        // Number keyboard
        const keys = document.querySelectorAll('.key[data-number]');
        keys.forEach(key => {
            key.addEventListener('click', () => {
                const number = key.getAttribute('data-number');
                this.handleKeyPress(number);
            });
        });

        // Enter and Clear buttons
        document.getElementById('enter-key').addEventListener('click', () => {
            this.checkAnswer();
        });

        document.getElementById('clear-key').addEventListener('click', () => {
            this.clearInput();
        });

        // Control buttons
        document.getElementById('new-problem-btn').addEventListener('click', () => {
            this.generateNewProblem();
        });

        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearInput();
        });

        document.getElementById('hint-btn').addEventListener('click', () => {
            this.showHint();
        });

        // Range sliders
        const minSlider = document.getElementById('min-number-slider');
        const maxSlider = document.getElementById('max-number-slider');
        const minValue = document.getElementById('min-number-value');
        const maxValue = document.getElementById('max-number-value');

        minSlider.addEventListener('input', (e) => {
            const newMin = parseInt(e.target.value);
            // Ensure min doesn't exceed max
            if (newMin >= this.maxTarget) {
                this.maxTarget = newMin + 1;
                maxSlider.value = this.maxTarget;
                maxValue.textContent = this.maxTarget;
            }
            this.minTarget = newMin;
            minValue.textContent = newMin;
        });

        maxSlider.addEventListener('input', (e) => {
            const newMax = parseInt(e.target.value);
            // Ensure max doesn't go below min
            if (newMax <= this.minTarget) {
                this.minTarget = newMax - 1;
                minSlider.value = this.minTarget;
                minValue.textContent = this.minTarget;
            }
            this.maxTarget = newMax;
            maxValue.textContent = newMax;
        });

        // Allow physical keyboard input
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                this.handleKeyPress(e.key);
            } else if (e.key === 'Backspace') {
                if (this.currentInput.length > 0) {
                    this.currentInput = this.currentInput.slice(0, -1);
                    this.updateDisplay();
                    this.clearFeedback();
                }
            } else if (e.key === 'Enter') {
                this.checkAnswer();
            } else if (e.key === 'Escape') {
                this.clearInput();
            }
        });

        // Click on missing addend circle to focus (visual feedback)
        document.getElementById('missing-addend').addEventListener('click', () => {
            // Add visual focus effect
            const circle = document.getElementById('missing-addend');
            circle.style.transform = 'scale(1.1)';
            setTimeout(() => {
                circle.style.transform = 'scale(1)';
            }, 200);
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NumberBondsGame();
});