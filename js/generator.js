export class MusicGenerator {
    constructor() {
        this.scales = {
            major: [0, 2, 4, 5, 7, 9, 11],
            minor: [0, 2, 3, 5, 7, 8, 10],
            dorian: [0, 2, 3, 5, 7, 9, 10],
            mixolydian: [0, 2, 4, 5, 7, 9, 10],
            blues: [0, 3, 5, 6, 7, 10],
            bebop: [0, 2, 4, 5, 7, 9, 10, 11],
            wholetone: [0, 2, 4, 6, 8, 10],
            diminished: [0, 2, 3, 5, 6, 8, 9, 11]
        };

        this.chordProgressions = {
            jazz: [
                ['maj7', 'min7', 'min7', 'dom7'],
                ['min7', 'dom7', 'maj7', 'maj7'],
                ['maj7', 'dom7', 'min7', 'min7'],
                ['min7', 'min7', 'dom7', 'maj7']
            ],
            blues: [
                ['dom7', 'dom7', 'dom7', 'dom7'],
                ['dom7', 'dom7', 'dom7', 'dom7'],
                ['min7', 'dom7', 'dom7', 'maj7']
            ],
            modal: [
                ['min7', 'min7', 'min7', 'min7'],
                ['maj7', 'maj7', 'maj7', 'maj7']
            ]
        };

        this.notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    }

    getNoteIndex(note) {
        return this.notes.indexOf(note);
    }

    getScaleNotes(rootNote, scaleType) {
        const rootIndex = this.getNoteIndex(rootNote);
        const scale = this.scales[scaleType] || this.scales.major;

        return scale.map(interval => {
            return this.notes[(rootIndex + interval) % 12];
        });
    }

    generateMelody(rootNote, scaleType, complexity, density, length = 16) {
        const scaleNotes = this.getScaleNotes(rootNote, scaleType);
        const melody = [];

        const notesPerBeat = density > 70 ? 4 : density > 40 ? 2 : 1;
        const useExtendedRange = complexity > 60;

        let currentOctave = 5;
        let previousNoteIndex = Math.floor(scaleNotes.length / 2);

        for (let i = 0; i < length; i++) {
            const shouldPlayNote = Math.random() * 100 < (density * 0.8 + 20);

            if (shouldPlayNote) {
                let noteIndex;

                if (complexity > 70) {
                    noteIndex = Math.floor(Math.random() * scaleNotes.length);
                } else {
                    const maxJump = Math.floor((complexity / 100) * 4) + 1;
                    const jump = Math.floor(Math.random() * maxJump * 2) - maxJump;
                    noteIndex = previousNoteIndex + jump;
                    noteIndex = Math.max(0, Math.min(scaleNotes.length - 1, noteIndex));
                }

                const note = scaleNotes[noteIndex];

                if (useExtendedRange && Math.random() > 0.7) {
                    currentOctave = 4 + Math.floor(Math.random() * 2);
                } else {
                    currentOctave = 5;
                }

                const duration = notesPerBeat > 2 ? 0.2 : notesPerBeat > 1 ? 0.4 : 0.8;

                melody.push({
                    note,
                    octave: currentOctave,
                    duration,
                    time: i * 0.5
                });

                previousNoteIndex = noteIndex;
            }
        }

        return melody;
    }

    generateChordProgression(rootNote, complexity) {
        const progressionType = complexity > 70 ? 'modal' : complexity > 40 ? 'jazz' : 'blues';
        const progressions = this.chordProgressions[progressionType];
        const progression = progressions[Math.floor(Math.random() * progressions.length)];

        const jazzDegrees = {
            'I': 0, 'II': 2, 'III': 4, 'IV': 5, 'V': 7, 'VI': 9, 'VII': 11
        };

        const rootIndex = this.getNoteIndex(rootNote);

        return progression.map((chordType, index) => {
            const degree = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][index % 7];
            const chordRoot = this.notes[(rootIndex + jazzDegrees[degree]) % 12];

            return {
                root: chordRoot,
                type: chordType,
                time: index * 4
            };
        });
    }

    getChordNotes(chordRoot, chordType) {
        const rootIndex = this.getNoteIndex(chordRoot);
        let intervals = [];

        switch (chordType) {
            case 'maj7':
                intervals = [0, 4, 7, 11];
                break;
            case 'min7':
                intervals = [0, 3, 7, 10];
                break;
            case 'dom7':
                intervals = [0, 4, 7, 10];
                break;
            case 'dim7':
                intervals = [0, 3, 6, 9];
                break;
            default:
                intervals = [0, 4, 7];
        }

        return intervals.map(interval => this.notes[(rootIndex + interval) % 12]);
    }

    generateHarmony(chordProgression, density) {
        const harmony = [];

        chordProgression.forEach(chord => {
            const chordNotes = this.getChordNotes(chord.root, chord.type);

            if (density > 60) {
                chordNotes.forEach((note, index) => {
                    harmony.push({
                        note,
                        octave: 4,
                        duration: 2,
                        time: chord.time + index * 0.1
                    });
                });
            } else if (density > 30) {
                [0, 2].forEach(index => {
                    harmony.push({
                        note: chordNotes[index],
                        octave: 4,
                        duration: 2,
                        time: chord.time + index * 0.1
                    });
                });
            } else {
                harmony.push({
                    note: chordNotes[0],
                    octave: 4,
                    duration: 2,
                    time: chord.time
                });
            }
        });

        return harmony;
    }

    generateBassline(chordProgression, density, swing) {
        const bassline = [];

        chordProgression.forEach((chord, chordIndex) => {
            const chordRoot = chord.root;
            const chordNotes = this.getChordNotes(chordRoot, chord.type);

            const notesPerChord = density > 60 ? 8 : density > 30 ? 4 : 2;
            const beatDuration = 4 / notesPerChord;

            for (let i = 0; i < notesPerChord; i++) {
                let note;

                if (i === 0) {
                    note = chordRoot;
                } else if (i % 2 === 0) {
                    note = chordNotes[Math.floor(Math.random() * chordNotes.length)];
                } else {
                    note = chordRoot;
                }

                const swingOffset = (i % 2 === 1 && swing > 50) ? (swing / 100) * 0.1 : 0;

                bassline.push({
                    note,
                    octave: 2 + Math.floor(Math.random() * 2),
                    duration: beatDuration * 0.8,
                    time: chord.time + i * beatDuration + swingOffset
                });
            }
        });

        return bassline;
    }

    generateDrumPattern(density, swing, length = 16) {
        const pattern = [];

        for (let i = 0; i < length; i++) {
            const beat = i % 4;
            const swingOffset = (i % 2 === 1 && swing > 50) ? (swing / 100) * 0.1 : 0;

            if (beat === 0 || (density > 50 && beat === 2)) {
                pattern.push({
                    type: 'kick',
                    time: i * 0.5 + swingOffset
                });
            }

            if (beat === 1 || beat === 3) {
                pattern.push({
                    type: 'snare',
                    time: i * 0.5 + swingOffset
                });
            }

            const hihatDensity = density > 70 ? 1 : density > 40 ? 0.7 : 0.5;
            if (Math.random() < hihatDensity) {
                pattern.push({
                    type: 'hihat',
                    closed: Math.random() > 0.3,
                    time: i * 0.5 + swingOffset
                });
            }

            if (density > 60 && Math.random() > 0.8) {
                pattern.push({
                    type: 'ride',
                    time: i * 0.5 + swingOffset
                });
            }
        }

        return pattern;
    }
}
