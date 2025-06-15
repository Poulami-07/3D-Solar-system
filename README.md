# Solar System Simulation - README

## Project Overview
This is an interactive 3D solar system simulation built using Three.js that accurately represents our solar system with realistic planet orbits, textures, and visual effects.

## Features
- **Full Solar System**: All 8 planets with relative sizes and distances
- **Realistic Orbits**: Elliptical paths with adjustable speeds
- **Interactive Controls**: 
  - Pause/resume animation
  - Adjust individual planet speeds
  - Click planets to zoom in
  - Manual camera controls
- **Visual Effects**:
  - Glowing sun with light emission
  - Planetary rings (Saturn, Uranus)
  - Asteroid belt 
  - Starfield background with nebula effects

## How to Run
1. **Host the files** on a local server (required for texture loading)
2. **Open index.html** in a modern browser
3. **Recommended browsers**: Chrome, Firefox, Edge (latest versions)

## Controls
| Action | Effect |
|--------|--------|
| Left-click planet | Zooms to planet |
| Right-click + drag | Rotates view |
| Mouse wheel | Zooms in/out |
| UI Pause button | Stops/starts animation |
| Speed Control | Adjusts planet orbit speeds |

## Technical Details
- Built with Three.js (r161)
- Uses GSAP for animations
- OBJ models for asteroids
- Responsive design adapts to screen size

## Project Structure
```
/solar-system
  ├── index.html         # Main HTML file
  ├── index.js           # Main JavaScript
  ├── /src               # Module files
  ├── /rocks             # Asteroid 3D models
  └── (textures)         # Planet image files
```

## Credits
- Three.js library
- GSAP animation library
- NASA imagery for planet textures

## Submission Notes
This project demonstrates:
- 3D rendering with Three.js
- Complex scene composition
- Interactive controls
- Realistic orbital mechanics
- Performance optimization for WebGL

**Student Name**: [Poulami Gandhi]    
**Date**: [12/06/2025]  
