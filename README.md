# Jazz Generator

A generative jazz music web application that creates authentic jazz compositions in real-time using Web Audio API synthesis and proper music theory.

## Features

### 🎹 Virtual Instruments
- **Piano**: Multi-partial synthesis with authentic piano envelope and jazz comping rhythms
- **Bass**: Upright bass sound with proper walking bass technique
- **Drums**: Ride cymbal, hi-hat, kick, snare, and ride bell with jazz feel

### 🎵 Authentic Jazz Generation
Built on proper jazz music theory:

- **Chord Progressions**: Real ii-V-I, I-vi-ii-V, blues changes, and rhythm changes
- **Chord Voicings**: Proper 7th chord extensions (9ths, 11ths, 13ths) with rootless voicings
- **Voice Leading**: Smooth transitions between chords
- **Walking Bass**: Uses chord tones on strong beats and chromatic approach tones
- **Piano Comping**: Syncopated rhythms with proper jazz voicings
- **Improvisation**: Scale-appropriate note choices (Dorian over min7, Mixolydian over dom7)
- **Swing Timing**: Authentic swing feel (adjustable ratio from straight to heavy swing)

### 🎚️ Minimal Interface
Clean, organized controls divided into three tabs:

**Style Tab:**
- Key selection
- Tempo (60-240 BPM)
- Complexity (affects extensions and alterations)
- Swing feel (50-75% ratio)
- 6 preset styles

**Mix Tab:**
- Individual instrument volumes
- Note density control

**Effects Tab:**
- Reverb
- Delay
- Tone (brightness/darkness)

### 🎨 Presets
- **Bebop**: Fast, virtuosic (200 BPM in Bb)
- **Cool Jazz**: Laid-back, sophisticated (120 BPM in D)
- **Modal**: Spacious, contemplative (110 BPM in D)
- **Swing**: Classic big band feel (160 BPM in F)
- **Latin**: Afro-Cuban influenced (140 BPM in G)
- **Ballad**: Slow and intimate (70 BPM in Eb)

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

### Music Theory Implementation
The generator implements authentic jazz theory:
- **Chord types**: maj7, min7, dom7, with proper extensions
- **Scales**: Mode-to-chord matching (Dorian for min7, Mixolydian for dom7, etc.)
- **Progressions**: ii-V-I, I-vi-ii-V, blues changes, rhythm changes
- **Voice leading**: Minimal movement between chord tones
- **Walking bass**: Root on beat 1, chord tones on 2-3, chromatic approach on 4
- **Swing ratio**: Variable from 1:1 (straight) to 3:1 (heavy), typically around 2:1
- **Comping patterns**: Syncopated rhythms (hits on & beats)
- **Improvisation**: Favors chord tones on strong beats, scale tones on weak beats

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
