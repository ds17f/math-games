# Brain Games

A collection of cognitive games to challenge your mind.

## Games

### Dot Card Game

The Dot Card Game helps you practice quick recognition of dot patterns (subitizing). It shows cards with 1-10 dots arranged in dice-like patterns.

Features:
- Display dot cards with 1-10 dots in dice-like patterns
- Show cards for a configurable amount of time (1-10 seconds)
- Bias mechanism that helps you practice cards you find challenging
- Responsive design that works on both desktop and mobile devices

## Directory Structure

```
dotgame/
├── index.html           # Homepage with game menu
├── server.js            # Express server
├── package.json         # Node.js package configuration
├── games/               # Directory containing all games
│   └── dotgame/         # Dot Card Game files
│       ├── index.html   # Dot Card Game UI
│       └── script.js    # Dot Card Game logic
├── app.py               # Alternative Flask server (deprecated)
└── start.sh             # Flask startup script (deprecated)
```

## Setup

### Option 1: Node.js/Express (Recommended)

1. Make sure you have Node.js installed on your computer
2. Open a terminal/command prompt
3. Navigate to the project directory
4. Install dependencies:

```bash
npm install
```

### Option 2: Python/Flask (Deprecated)

1. Make sure you have Python installed on your computer
2. Open a terminal/command prompt
3. Navigate to the project directory
4. Create and activate the virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate on macOS/Linux
source venv/bin/activate

# Activate on Windows
# venv\Scripts\activate
```

5. Install required packages:

```bash
pip install flask
```

## How to Run

### Using Node.js/Express (Recommended)

```bash
npm start
```
or
```bash
node server.js
```

### Using Python/Flask (Deprecated)

Use the provided start script:

```bash
./start.sh
```

Or run manually:

```bash
source venv/bin/activate
python app.py
```

The application will automatically open in your default browser. To access from your phone or other devices, connect to the same WiFi network as your computer and enter the Network URL displayed in the terminal.

## Homepage

The homepage provides a menu of all available games:
- Click on a game card to navigate to that game
- Each game has its own dedicated page with specific controls

## Dot Card Game Usage

- Click "Show Next Card" to display the next dot card (1-10)
- The card will display for the number of seconds set on the slider
- Click "Show Again" to display the current card again
- Use "Bias -" to decrease the probability of seeing the current card
- Use "Bias +" to increase the probability of seeing the current card
- Click "Show Probability" to see the current probability distribution
- Use "Reset Progress" to reset all card weights to default
- Use the slider to adjust the display time from 1-10 seconds