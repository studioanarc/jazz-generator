export const presets = {
    'cool-jazz': {
        rootNote: 'F',
        scaleType: 'dorian',
        tempo: 100,
        complexity: 35,
        density: 40,
        swing: 60,
        instruments: {
            piano: true,
            bass: true,
            organ: false,
            drums: true
        },
        effects: {
            reverb: 60,
            delay: 30,
            filterFreq: 70,
            distortion: 0
        }
    },
    'bebop': {
        rootNote: 'Bb',
        scaleType: 'bebop',
        tempo: 180,
        complexity: 80,
        density: 75,
        swing: 70,
        instruments: {
            piano: true,
            bass: true,
            organ: false,
            drums: true
        },
        effects: {
            reverb: 40,
            delay: 20,
            filterFreq: 85,
            distortion: 5
        }
    },
    'fusion': {
        rootNote: 'E',
        scaleType: 'mixolydian',
        tempo: 140,
        complexity: 65,
        density: 70,
        swing: 55,
        instruments: {
            piano: true,
            bass: true,
            organ: true,
            drums: true
        },
        effects: {
            reverb: 50,
            delay: 45,
            filterFreq: 75,
            distortion: 25
        }
    },
    'modal': {
        rootNote: 'D',
        scaleType: 'dorian',
        tempo: 90,
        complexity: 30,
        density: 35,
        swing: 50,
        instruments: {
            piano: true,
            bass: true,
            organ: true,
            drums: true
        },
        effects: {
            reverb: 70,
            delay: 40,
            filterFreq: 65,
            distortion: 0
        }
    },
    'free-jazz': {
        rootNote: 'Ab',
        scaleType: 'wholetone',
        tempo: 160,
        complexity: 95,
        density: 85,
        swing: 50,
        instruments: {
            piano: true,
            bass: true,
            organ: true,
            drums: true
        },
        effects: {
            reverb: 55,
            delay: 60,
            filterFreq: 80,
            distortion: 15
        }
    },
    'smooth': {
        rootNote: 'G',
        scaleType: 'major',
        tempo: 85,
        complexity: 25,
        density: 45,
        swing: 65,
        instruments: {
            piano: true,
            bass: true,
            organ: true,
            drums: true
        },
        effects: {
            reverb: 65,
            delay: 35,
            filterFreq: 60,
            distortion: 0
        }
    }
};
