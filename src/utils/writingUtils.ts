/**
 * Statistics and text processing utilities for InkPad
 */

export interface TextStats {
    words: number;
    characters: number;
    sentences: number;
    readingTime: number; // in minutes
}

export function calculateStats(text: string): TextStats {
    const trimmedText = text.trim();
    if (!trimmedText) {
        return { words: 0, characters: 0, sentences: 0, readingTime: 0 };
    }

    const words = trimmedText.split(/\s+/).length;
    const characters = text.length;
    const sentences = trimmedText.split(/[.!?]+/).filter(Boolean).length;

    // Average reading speed is ~225 words per minute
    const readingTime = Math.ceil(words / 225);

    return { words, characters, sentences, readingTime };
}

export type TextCase = 'upper' | 'lower' | 'title' | 'sentence';

export function convertCase(text: string, type: TextCase): string {
    switch (type) {
        case 'upper':
            return text.toUpperCase();
        case 'lower':
            return text.toLowerCase();
        case 'title':
            return text.toLowerCase().split(' ').map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(' ');
        case 'sentence':
            return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        default:
            return text;
    }
}

export function cleanupText(text: string, options: {
    extraSpaces?: boolean;
    lineBreaks?: boolean;
    trim?: boolean;
}): string {
    let result = text;

    if (options.extraSpaces) {
        result = result.replace(/[ \t]+/g, ' ');
    }

    if (options.lineBreaks) {
        result = result.replace(/\n\s*\n/g, '\n');
    }

    if (options.trim) {
        result = result.trim();
    }

    return result;
}

export function findAndReplace(text: string, find: string, replace: string, caseSensitive: boolean = false): string {
    if (!find) return text;
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    return text.replace(regex, replace);
}

/**
 * Basic Spell Check Logic (Skeleton)
 * For a real app, this would use a large dictionary or an external API.
 */
export function getSuggestions(word: string): string[] {
    // This is a placeholder. A real implementation would use a Levenshtein distance 
    // or a prefix tree with a dictionary.
    const dummyDictionary = ['handwriting', 'manuscript', 'inkpad', 'calligraphy', 'stationery'];
    return dummyDictionary.filter(w => w.startsWith(word.toLowerCase().slice(0, 3))).slice(0, 3);
}
