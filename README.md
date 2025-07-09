# Goremongers GORE TANK Tracker

A digital tracker for the Goremongers tabletop game's GORE TANK mechanic. This web application helps you manage your operatives' gore tank levels during battles.

## Features

- **Operative Management**: Add and remove operatives as needed
- **Tank Level Tracking**: Visual representation of empty, half, and full tank levels
- **Game Rules Integration**: Automatic enforcement of tank level limits
- **Editable Names**: Click on operative names to customize them
- **Persistent Storage**: Your data is saved locally in your browser
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. **Open the tracker**: Simply open `index.html` in your web browser
2. **Add operatives**: Click "Add Operative" to create new operatives (they start at half level)
3. **Track tank levels**: Use the Increase/Decrease buttons to adjust tank levels based on game actions
4. **Customize names**: Click on operative names to edit them
5. **Reset all**: Use "Reset All to Half" to return all operatives to half level

## GORE TANK Rules

- **Starting Level**: All operatives begin at **HALF** level
- **Increase Tank**: When a friendly Goremonger operative incapacitates an operative within its control range, or visible to and within 2" of it
- **Decrease Tank**: When a friendly Goremonger operative uses a SANGUAVITAE rule
- **Limits**: Tanks cannot increase when full or decrease when empty

## Visual Indicators

- **Empty**: Gray color, no fill
- **Half**: Orange/yellow color, 50% fill
- **Full**: Red color, 100% fill with glow effect

## Technical Details

- **Pure HTML/CSS/JavaScript**: No external dependencies required
- **Local Storage**: Data persists between browser sessions
- **Mobile Friendly**: Responsive design that works on all screen sizes
- **Dark Theme**: Gothic aesthetic matching the game's theme

## File Structure

```
goremongers-tracker/
├── index.html      # Main HTML file
├── styles.css      # Styling and visual effects
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Getting Started

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start tracking your Goremongers operatives!

No installation or setup required - just open the HTML file and you're ready to go! 