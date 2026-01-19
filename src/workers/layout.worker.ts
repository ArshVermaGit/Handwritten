/**
 * Web Worker for heavy layout calculations
 */

interface Token {
    type: 'tag' | 'text';
    tagName?: string;
    isClosing?: boolean;
    attributes?: { src?: string };
    content?: string;
}

const tokenizeHTML = (html: string): Token[] => {
    const tokens: Token[] = [];
    const cleanHtml = html
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
        
    const regex = /(<[^>]+>|[^<]+)/g;
    let match;
    while ((match = regex.exec(cleanHtml)) !== null) {
        const part = match[0];
        if (part.startsWith('<')) {
            const lower = part.toLowerCase();
            const isClosing = lower.startsWith('</');
            const tagName = lower.replace(/[<>/]/g, '').split(' ')[0];
            
            const attributes: { src?: string } = {};
            if (tagName === 'img') {
                const srcMatch = part.match(/src="([^"]+)"/i);
                if (srcMatch) attributes.src = srcMatch[1];
            }
            
            const supported = ['b', 'strong', 'i', 'em', 'u', 'h1', 'h2', 'h3', 'p', 'div', 'br', 'img', 'ul', 'ol', 'li'];
            if (supported.includes(tagName)) {
                tokens.push({ type: 'tag', tagName, isClosing, attributes });
            }
        } else {
            const words = part.split(/(\s+)/);
            words.forEach(word => {
                if (word) tokens.push({ type: 'text', content: word });
            });
        }
    }
    return tokens;
};

// Simplified measuring for worker (since it doesn't have access to Canvas)
// We'll use a rough approximation or pass character widths from main thread if needed
// For now, let's just return the tokens and let the main thread do the placement
// but in chunks. Or better: we can pass a Map of character widths.

self.onmessage = async (e: MessageEvent) => {
    const { text, type } = e.data;

    if (type === 'LAYOUT') {
        const tokens = tokenizeHTML(text);
        // We could do more here, like hyphenation logic or page break estimations
        self.postMessage({ type: 'LAYOUT_COMPLETE', tokens });
    }
};
