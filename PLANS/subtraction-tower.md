# Subtraction Tower Game Plan

## Game Overview
**Subtraction Tower** is a 2-player competitive game where players race to reach exactly 0 from a starting value of 500 through strategic subtraction and regrouping explanations.

## Game Rules
- **Starting Position**: Both players start at 500
- **Turn Structure**: Players take turns rolling a die/spinner to generate subtraction problems
- **Subtraction Problems**: Random values like "subtract 27" or "subtract 154"
- **Win Condition**: First player to reach exactly 0 wins
- **Educational Requirement**: Players must explain regrouping when needed

## Core Mechanics

### 1. Player Management
- Two-player turn-based system
- Track current values for both players
- Display whose turn it is

### 2. Problem Generation
- Generate random subtraction amounts (range: 10-200)
- Ensure problems require regrouping for educational value
- Problems should be solvable (not result in negative numbers)

### 3. Regrouping Explanation System
- When regrouping is required, player must demonstrate understanding
- Visual representation of regrouping process
- Multiple choice or step-by-step explanation interface

### 4. Game Flow
```
1. Display both players' current values
2. Show whose turn it is
3. Generate/display subtraction problem
4. If regrouping needed:
   - Present regrouping explanation interface
   - Validate player's understanding
5. Apply subtraction to player's value
6. Check win condition
7. Switch to next player
```

## Technical Implementation

### File Structure
- `games/subtractiontower/index.html` - Main game file
- Follow existing game patterns from regrouping and raceto100

### Key Components

#### HTML Structure
```html
- Game container with styling consistent with other games
- Two player score displays (left/right layout)
- Current turn indicator
- Problem display area
- Regrouping explanation interface
- Control buttons (New Game, Reset)
- Home link
```

#### CSS Styling
- Follow existing game styling patterns
- Two-column layout for players
- Highlight active player
- Visual feedback for correct/incorrect responses
- Mobile-responsive design

#### JavaScript Game Class
```javascript
class SubtractionTowerGame {
  constructor() {
    // Player management
    this.player1Value = 500;
    this.player2Value = 500;
    this.currentPlayer = 1;
    this.gameActive = true;
    
    // Problem management
    this.currentProblem = 0;
    this.needsRegrouping = false;
    
    // Initialize game
  }
  
  // Core methods:
  generateProblem()        // Create random subtraction
  checkRegrouping()        // Determine if regrouping needed
  showRegroupingChallenge()// Present explanation interface
  validateRegrouping()     // Check player's explanation
  executeSubtraction()     // Apply the subtraction
  checkWinCondition()      // Check if game over
  switchPlayer()           // Move to next player
  resetGame()              // Start over
}
```

### Regrouping Logic
- Detect when subtraction requires borrowing
- Present visual/interactive explanation
- Multiple validation methods:
  - Step-by-step breakdown
  - Multiple choice questions
  - Visual manipulation interface

### Problem Generation Algorithm
```javascript
// Ensure educational value and solvability
function generateProblem(currentValue) {
  // Range: 10-200, weighted toward regrouping scenarios
  let subtractAmount;
  
  // 70% chance of requiring regrouping
  if (Math.random() < 0.7) {
    // Generate amount that requires regrouping
    subtractAmount = generateRegroupingProblem(currentValue);
  } else {
    // Simple subtraction, no regrouping
    subtractAmount = generateSimpleProblem(currentValue);
  }
  
  // Ensure result >= 0
  return Math.min(subtractAmount, currentValue);
}
```

## Integration with Existing System

### Home Page Addition
Add new game card to main index.html:
```html
<div class="game-card">
  <div class="game-image">
    <div style="font-size: 20px; font-weight: bold; line-height: 1.2;">
      500<br>↓<br>- 127<br>= ?
    </div>
  </div>
  <div class="game-info">
    <h3 class="game-title">Subtraction Tower</h3>
    <p class="game-description">2-player race to zero! Practice regrouping and explain your thinking.</p>
    <a href="/games/subtractiontower/index.html" class="play-button">Play Now</a>
  </div>
</div>
```

### Score Management
- Add 'subtractiontower' to ScoreManager.gameConfig
- Track wins, games played, fastest completion time
- Two-player score tracking

## Educational Goals
1. **Regrouping Mastery**: Reinforce borrowing concepts
2. **Mental Math**: Quick subtraction skills
3. **Strategic Thinking**: Competitive element encourages engagement
4. **Explanation Skills**: Verbalize mathematical thinking

## Development Phases

### Phase 1: Basic Game Structure
- HTML layout and styling
- Two-player display system
- Turn management
- Basic subtraction without regrouping

### Phase 2: Problem Generation
- Random subtraction generation
- Regrouping detection algorithm
- Problem validation (no negative results)

### Phase 3: Regrouping Interface
- Visual explanation system
- Multiple validation methods
- Educational feedback

### Phase 4: Polish & Integration
- Add to main menu
- Score system integration
- Testing and refinement
- Mobile responsiveness

## Success Criteria
- Two players can play competitively
- Regrouping explanations are educational and engaging
- Game integrates seamlessly with existing system
- Mobile-friendly interface
- Clear win/lose conditions and feedback