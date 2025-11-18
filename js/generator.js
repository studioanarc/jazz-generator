export class MusicGenerator {
    constructor() {
        this.notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

        // Jazz chord progressions (in scale degrees)
        this.progressions = {
            'ii-V-I': [
                {degree: 2, type: 'min7'},
                {degree: 5, type: 'dom7'},
                {degree: 1, type: 'maj7'},
                {degree: 6, type: 'min7'}
            ],
            'I-vi-ii-V': [
                {degree: 1, type: 'maj7'},
                {degree: 6, type: 'min7'},
                {degree: 2, type: 'min7'},
                {degree: 5, type: 'dom7'}
            ],
            'blues': [
                {degree: 1, type: 'dom7'},
                {degree: 4, type: 'dom7'},
                {degree: 1, type: 'dom7'},
                {degree: 5, type: 'dom7'}
            ],
            'rhythm-changes': [
                {degree: 1, type: 'maj7'},
                {degree: 6, type: 'dom7'},
                {degree: 2, type: 'min7'},
                {degree: 5, type: 'dom7'}
            ]
        };

        // Scale intervals for each chord type (for improvisation)
        this.scaleForChord = {
            'maj7': [0, 2, 4, 5, 7, 9, 11],      // Ionian (major)
            'min7': [0, 2, 3, 5, 7, 9, 10],      // Dorian
            'dom7': [0, 2, 4, 5, 7, 9, 10],      // Mixolydian
            'dim7': [0, 2, 3, 5, 6, 8, 9, 11],   // Diminished
            'min7b5': [0, 2, 3, 5, 6, 8, 10]     // Locrian
        };
    }

    getNoteIndex(note) {
        return this.notes.indexOf(note);
    }

    transposeNote(note, semitones) {
        const index = this.getNoteIndex(note);
        return this.notes[(index + semitones + 12) % 12];
    }

    // Get scale degree intervals (for building chords and progressions)
    getScaleDegree(rootNote, degree) {
        const intervals = [0, 2, 4, 5, 7, 9, 11]; // Major scale
        const rootIndex = this.getNoteIndex(rootNote);
        const interval = intervals[(degree - 1) % 7];
        return this.notes[(rootIndex + interval) % 12];
    }

    // Generate proper jazz chord with extensions
    getChordVoicing(root, chordType, octave = 4, includeExtensions = true) {
        const rootIndex = this.getNoteIndex(root);
        let intervals = [];

        switch (chordType) {
            case 'maj7':
                intervals = includeExtensions ? [4, 7, 11, 14] : [0, 4, 7, 11]; // 3, 5, 7, 9 (rootless voicing)
                break;
            case 'min7':
                intervals = includeExtensions ? [3, 7, 10, 14] : [0, 3, 7, 10]; // 3, 5, 7, 9
                break;
            case 'dom7':
                intervals = includeExtensions ? [4, 7, 10, 14] : [0, 4, 7, 10]; // 3, 5, 7, 9
                break;
            case 'dim7':
                intervals = [0, 3, 6, 9]; // 1, b3, b5, bb7
                break;
            case 'min7b5':
                intervals = [0, 3, 6, 10]; // 1, b3, b5, 7
                break;
        }

        // Create voicing (spread across octaves for better voice leading)
        const voicing = intervals.map((interval, i) => {
            const noteIndex = (rootIndex + interval) % 12;
            const noteOctave = octave + Math.floor(i / 3);
            return {
                note: this.notes[noteIndex],
                octave: noteOctave
            };
        });

        return voicing;
    }

    // Generate chord progression
    generateProgression(rootNote, style = 'bebop') {
        let template;

        switch (style) {
            case 'bebop':
                template = this.progressions['ii-V-I'];
                break;
            case 'cool':
            case 'modal':
                template = this.progressions['ii-V-I'];
                break;
            case 'swing':
                template = this.progressions['I-vi-ii-V'];
                break;
            case 'latin':
                template = this.progressions['rhythm-changes'];
                break;
            case 'ballad':
                template = this.progressions['I-vi-ii-V'];
                break;
            default:
                template = this.progressions['ii-V-I'];
        }

        return template.map((chord, index) => {
            const chordRoot = this.getScaleDegree(rootNote, chord.degree);
            return {
                root: chordRoot,
                type: chord.type,
                time: index * 4, // 4 beats per chord
                duration: 4
            };
        });
    }

    // Generate scale notes for improvisation based on current chord
    getImprovisationScale(chordRoot, chordType) {
        const rootIndex = this.getNoteIndex(chordRoot);
        const scaleIntervals = this.scaleForChord[chordType] || this.scaleForChord['maj7'];

        return scaleIntervals.map(interval => this.notes[(rootIndex + interval) % 12]);
    }

    // Generate jazz melody with proper phrasing
    generateMelody(progression, complexity, density, swing) {
        const melody = [];
        const beatsPerMeasure = 4;

        progression.forEach(chord => {
            const scale = this.getImprovisationScale(chord.root, chord.type);
            const chordTones = this.getChordVoicing(chord.root, chord.type, 5, false).map(v => v.note);

            // Number of notes based on density
            const notesInMeasure = Math.floor(2 + (density / 100) * 6);

            for (let i = 0; i < notesInMeasure; i++) {
                // Favor chord tones on strong beats
                const isStrongBeat = i % 2 === 0;
                const useChordTone = isStrongBeat ? Math.random() > 0.3 : Math.random() > 0.6;

                let note;
                if (useChordTone) {
                    note = chordTones[Math.floor(Math.random() * chordTones.length)];
                } else {
                    note = scale[Math.floor(Math.random() * scale.length)];
                }

                // Octave selection
                const octave = 5 + (Math.random() > 0.7 ? 1 : 0);

                // Duration with jazz phrasing (some notes longer, some shorter)
                const baseDuration = beatsPerMeasure / notesInMeasure;
                const duration = baseDuration * (Math.random() > 0.5 ? 0.8 : 1.2);

                // Calculate time with swing
                let time = chord.time + (i * beatsPerMeasure / notesInMeasure);

                // Add rests for phrasing
                if (Math.random() < (100 - density) / 200) {
                    continue; // Skip this note for phrasing
                }

                melody.push({
                    note,
                    octave,
                    duration,
                    time,
                    velocity: 0.6 + Math.random() * 0.3 // Vary dynamics
                });
            }
        });

        return melody;
    }

    // Generate walking bass line with proper technique
    generateWalkingBass(progression, density, swing) {
        const bassline = [];

        progression.forEach((chord, chordIndex) => {
            const chordTones = this.getChordVoicing(chord.root, chord.type, 2, false);
            const root = chordTones[0];
            const third = chordTones[1];
            const fifth = chordTones[2];
            const seventh = chordTones[3];

            // Get next chord's root for approach tone
            const nextChord = progression[(chordIndex + 1) % progression.length];
            const nextRoot = nextChord.root;

            // 4 beats per measure
            const beats = 4;

            for (let beat = 0; beat < beats; beat++) {
                let note, octave = 2;

                if (beat === 0) {
                    // Beat 1: Root
                    note = root.note;
                    octave = root.octave;
                } else if (beat === 1) {
                    // Beat 2: Third or Fifth
                    const voiceNote = Math.random() > 0.5 ? third : fifth;
                    note = voiceNote.note;
                    octave = voiceNote.octave;
                } else if (beat === 2) {
                    // Beat 3: Fifth or Seventh
                    const voiceNote = Math.random() > 0.5 ? fifth : seventh;
                    note = voiceNote.note;
                    octave = voiceNote.octave;
                } else {
                    // Beat 4: Chromatic approach to next chord's root
                    const nextRootIndex = this.getNoteIndex(nextRoot);
                    const approachDirection = Math.random() > 0.5 ? -1 : 1;
                    note = this.notes[(nextRootIndex + approachDirection + 12) % 12];
                    octave = 2;
                }

                // Simplify for lower density
                if (density < 50 && beat % 2 === 1 && Math.random() > (density / 50)) {
                    continue;
                }

                bassline.push({
                    note,
                    octave,
                    duration: 0.9, // Slightly detached
                    time: chord.time + beat,
                    velocity: beat === 0 ? 0.8 : 0.6 // Accent on beat 1
                });
            }
        });

        return bassline;
    }

    // Generate comping pattern (piano/organ chords with rhythm)
    generateComping(progression, density) {
        const comping = [];

        progression.forEach(chord => {
            const voicing = this.getChordVoicing(chord.root, chord.type, 4, true);

            // Syncopated rhythm patterns with anticipations
            const patterns = [
                [0.5, 2, 3.5],              // Syncopated
                [1, 2.5],                   // On 2 and & of 3
                [0, 2, 3],                  // 1, 3, 4
                [1.5, 3.5],                 // & of 2, & of 4
                [0.75, 2.75],               // Anticipations
                [1.5, 2.5, 3.5],            // Dense offbeats
                [0, 1.5, 3.75],             // Mixed with anticipation
                [2, 3.5]                    // Minimal, breathing room
            ];

            const pattern = patterns[Math.floor(Math.random() * patterns.length)];

            pattern.forEach(offset => {
                // Skip some hits based on density
                if (Math.random() > density / 100) return;

                // Occasional anticipation (play slightly early)
                const anticipation = (Math.random() > 0.8) ? -0.125 : 0;

                voicing.forEach((voice, i) => {
                    comping.push({
                        note: voice.note,
                        octave: voice.octave,
                        duration: 0.6 + Math.random() * 0.3, // Varied duration
                        time: chord.time + offset + anticipation,
                        velocity: 0.3 + Math.random() * 0.3, // Varied dynamics
                        stagger: i * 0.01 // Slight stagger for humanization
                    });
                });
            });
        });

        return comping;
    }

    // Generate jazz drum pattern with proper swing
    generateDrumPattern(style, density, swing, lengthInBeats) {
        const pattern = [];
        const beatsPerMeasure = 4;
        const measures = lengthInBeats / beatsPerMeasure;

        for (let m = 0; m < measures; m++) {
            const measureStart = m * beatsPerMeasure;

            // Ride cymbal pattern (main timekeeping)
            for (let beat = 0; beat < beatsPerMeasure; beat++) {
                // Swing pattern on ride: strong on 1 and 3, lighter on 2 and 4
                if (beat % 2 === 0 || Math.random() > 0.3) {
                    pattern.push({
                        type: 'ride',
                        time: measureStart + beat,
                        velocity: beat % 2 === 0 ? 0.7 : 0.5
                    });
                }

                // Add ride bell occasionally
                if (Math.random() > 0.85) {
                    pattern.push({
                        type: 'ride-bell',
                        time: measureStart + beat,
                        velocity: 0.6
                    });
                }
            }

            // Hi-hat on 2 and 4 (backbeat)
            pattern.push({
                type: 'hihat-closed',
                time: measureStart + 1,
                velocity: 0.5
            });
            pattern.push({
                type: 'hihat-closed',
                time: measureStart + 3,
                velocity: 0.5
            });

            // Bass drum (sparse in jazz)
            if (m % 2 === 0) {
                pattern.push({
                    type: 'kick',
                    time: measureStart,
                    velocity: 0.6
                });
            }
            if (Math.random() > 0.6) {
                pattern.push({
                    type: 'kick',
                    time: measureStart + 2 + Math.random() * 0.5,
                    velocity: 0.4
                });
            }

            // Snare accents and comping
            if (Math.random() > 0.5) {
                pattern.push({
                    type: 'snare',
                    time: measureStart + 2 + Math.random(),
                    velocity: 0.3 + Math.random() * 0.3
                });
            }
        }

        return pattern;
    }
}
