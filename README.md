# Quantum Jazz Generator

A futuristic generative jazz music web application that creates infinite, evolving jazz compositions in real-time using Web Audio API synthesis.

## Features

### 🎹 Virtual Instruments
- **Piano**: Multi-harmonic synthesis with realistic envelope
- **Bass**: Rich sawtooth synth with sub-oscillator
- **Organ**: Hammond-style drawbar synthesis with multiple harmonics
- **Drums**: Kick, snare, hi-hat, and ride cymbal synthesis

### 🎵 Intelligent Music Generation
- **Melody Generation**: Context-aware melodic lines based on scales and complexity settings
- **Harmony Generation**: Jazz chord progressions (ii-V-I, blues changes, modal harmony)
- **Bassline Generation**: Walking bass patterns that follow chord changes
- **Drum Patterns**: Swing-aware rhythms with configurable density

### 🎚️ User Controls
- **Root Note**: Select the key (C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B)
- **Scale/Mode**: Choose from Major, Minor, Dorian, Mixolydian, Blues, Bebop, Whole Tone, Diminished
- **Tempo**: 60-240 BPM
- **Harmonic Complexity**: Slide from harmonic to wild (affects chord extensions and note choices)
- **Note Density**: Control how many notes are generated
- **Swing Feel**: Adjust from straight to heavy swing

### 🎛️ Effects
- **Reverb**: Convolution reverb for space and depth
- **Delay**: Tempo-synced delay with feedback
- **Filter**: Low-pass filter for tone shaping
- **Distortion**: Add grit and character

### 🎨 Presets
- **Cool Jazz**: Relaxed, modal feel (F Dorian, 100 BPM)
- **Bebop**: Fast, complex melodies (Bb Bebop, 180 BPM)
- **Fusion**: Electric energy with effects (E Mixolydian, 140 BPM)
- **Modal**: Spacious and meditative (D Dorian, 90 BPM)
- **Free Jazz**: Experimental and wild (Ab Whole Tone, 160 BPM)
- **Smooth**: Easy listening jazz (G Major, 85 BPM)

## How to Use

1. **Open the Application**: Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)

2. **Select a Preset** (Optional): Click one of the preset buttons to quickly get started with a specific jazz style

3. **Customize Parameters**:
   - Choose your root note and scale
   - Adjust tempo, complexity, and density sliders
   - Toggle instruments on/off
   - Tweak effects to taste

4. **Start Playing**: Click the **START** button to begin generating music

5. **Experiment**: Change parameters in real-time while the music is playing (note: melodic/harmonic changes will apply to the next measure)

6. **Stop**: Click the **STOP** button when you're done

## Technical Details

### Architecture
- **audio-engine.js**: Core Web Audio API context and master chain
- **instruments.js**: Synthesizer implementations for each instrument
- **effects.js**: Audio effects processing chain
- **generator.js**: Music theory and generation algorithms
- **presets.js**: Preset configurations
- **main.js**: Application controller and UI management

### Music Theory
The generator uses jazz-appropriate music theory:
- Scales include jazz modes (Dorian, Mixolydian) and bebop scales
- Chord progressions use ii-V-I patterns and modal harmony
- Swing timing is applied to rhythms
- Note selection considers harmonic context and voice leading

### Browser Requirements
- Modern browser with Web Audio API support
- Works best in Chrome, Firefox, Safari, or Edge
- No plugins or external dependencies required

## Development

The application is built with vanilla JavaScript and uses ES6 modules. No build step is required.

### File Structure
```
jazz-generator/
├── index.html          # Main HTML structure
├── styles.css          # Futuristic styling and animations
├── js/
│   ├── main.js         # Application controller
│   ├── audio-engine.js # Web Audio API setup
│   ├── instruments.js  # Virtual instrument classes
│   ├── effects.js      # Audio effects processors
│   ├── generator.js    # Music generation algorithms
│   └── presets.js      # Preset configurations
└── README.md          # This file
```

## License

MIT License - Feel free to use, modify, and distribute as you wish.

## Credits

Built with Web Audio API and modern web technologies.
