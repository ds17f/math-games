# Dot Card Game

A simple web application that displays dot cards (like dice, but from 1 to 10 dots) with timer functionality.

## Features

- Display dot cards with 1-10 dots
- Show cards for a configurable amount of time (1-10 seconds)
- Two control buttons: "Show Next Card" and "Show Again"
- Responsive design that works on both desktop and mobile devices

## Setup

### Option 1: Node.js/Express (Recommended)

1. Make sure you have Node.js installed on your computer
2. Open a terminal/command prompt
3. Navigate to the project directory
4. Install dependencies:

```bash
npm install
```

### Option 2: Python/Flask

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

### Using Python/Flask

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

## Usage

- Click "Show Next Card" to display the next dot card (1-10)
- The card will display for the number of seconds set on the slider
- Click "Show Again" to display the current card again
- Use the slider to adjust the display time from 1-10 seconds