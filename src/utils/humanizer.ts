/**
 * AI Text Humanizer Utility
 * Transforms rigid AI-generated text into natural, human-like writing by introducing
 * subtle imperfections, natural variations, and phrasing changes.
 */

const TYPOS: Record<string, string[]> = {
    'the': ['teh', 'the '],
    'and': ['and', 'andnd', 'adn'],
    'that': ['thta', 'that '],
    'with': ['wiht', 'withh'],
    'this': ['thsi', 'this'],
    'you': ['yu', 'uou'],
    'would': ['woudl', 'would'],
    'could': ['coudl', 'could'],
};

const FILLER_PHRASES = [
    ', you know,',
    ', actually,',
    ', basically,',
    '... I mean,',
    ', like,',
];

export function humanizeText(text: string, intensity: number = 0.5): string {
    let lines = text.split('\n');

    const humanizedLines = lines.map(line => {
        let words = line.split(' ');

        // 1. Introduction of natural errors and variations
        const processedWords = words.map(word => {
            const rand = Math.random();

            // Subtle Typo Correction Simulation (Type the wrong char, then "backspace" it)
            // In handwriting, this looks like a crossed-out word or a letter written over
            if (rand < 0.02 * intensity && word.length > 3) {
                const typo = TYPOS[word.toLowerCase()];
                if (typo) return typo[Math.floor(Math.random() * typo.length)];
            }

            return word;
        });

        // 2. Phrase Variation
        if (Math.random() < 0.05 * intensity) {
            const filler = FILLER_PHRASES[Math.floor(Math.random() * FILLER_PHRASES.length)];
            const insertIdx = Math.floor(Math.random() * (processedWords.length - 1)) + 1;
            processedWords.splice(insertIdx, 0, filler);
        }

        return processedWords.join(' ');
    });

    // 3. Natural Paragraphing
    // Sometimes humans combine or split paragraphs differently than AI
    let finalOutput = humanizedLines.join('\n');

    // 4. Case Variation (Optional, but humans sometimes miss capitals)
    if (Math.random() < 0.02 * intensity) {
        finalOutput = finalOutput.replace(/\. [A-Z]/g, (match) => match.toLowerCase());
    }

    return finalOutput;
}

/**
 * Simulates human writing behavior such as cross-outs and insertions.
 * These will be passed to the renderer to draw specific physical markers.
 */
export interface Humanimperfection {
    type: 'cross-out' | 'insertion' | 'ink-blot';
    index: number;
    text?: string;
}

export function generateImperfections(text: string): Humanimperfection[] {
    const imperfections: Humanimperfection[] = [];
    const occurrences = text.split(' ').length;

    for (let i = 0; i < occurrences; i++) {
        if (Math.random() < 0.03) {
            imperfections.push({
                type: Math.random() > 0.3 ? 'cross-out' : 'ink-blot',
                index: i
            });
        }
    }

    return imperfections;
}
