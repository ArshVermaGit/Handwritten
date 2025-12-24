import { useRef, useState, useEffect } from 'react';
import { useStore } from '../lib/store';

export default function TextEditor() {
    const { text, setText, currentPageIndex } = useStore();

    const [localText, setLocalText] = useState(text);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sync with store on page switch
    useEffect(() => {
        setLocalText(text);
    }, [text, currentPageIndex]);

    // Debounced update to store
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localText !== text) {
                setText(localText);
            }
        }, 150);
        return () => clearTimeout(timer);
    }, [localText, text, setText]);

    const charCount = localText.length;
    const wordCount = localText.trim() ? localText.trim().split(/\s+/).length : 0;
    const pageCount = Math.ceil(charCount / 2000) || 1;

    return (
        <div className="h-full flex flex-col p-12 bg-white">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl text-gray-300 font-light italic mb-2">
                    Start writing your masterpiece...
                </h1>
                <p className="text-gray-400 text-sm">
                    Type or paste your text below. It will be converted to handwriting in real-time.
                </p>
            </div>

            {/* Textarea Container */}
            <div className="flex-1 relative">
                <textarea
                    ref={textareaRef}
                    value={localText}
                    onChange={(e) => setLocalText(e.target.value)}
                    spellCheck={false}
                    placeholder="Start typing or upload a text file..."
                    className="w-full h-full p-6 text-base leading-relaxed resize-none bg-[#FAFAFA] border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 placeholder:italic text-gray-800"
                    style={{ lineHeight: '1.8' }}
                />
            </div>

            {/* Stats Bar */}
            <div className="mt-4 flex justify-between items-center px-4 py-3 bg-gray-50 rounded-xl">
                <div className="flex gap-6">
                    <div className="text-sm text-gray-500">
                        <span className="font-bold text-gray-800">{charCount.toLocaleString()}</span> Characters
                    </div>
                    <div className="text-sm text-gray-500">
                        <span className="font-bold text-gray-800">{wordCount.toLocaleString()}</span> Words
                    </div>
                    <div className="text-sm text-gray-500">
                        <span className="font-bold text-gray-800">{pageCount}</span> {pageCount === 1 ? 'Page' : 'Pages'}
                    </div>
                </div>
                <div className="text-xs text-gray-400 font-medium">
                    Page {currentPageIndex + 1}
                </div>
            </div>
        </div>
    );
}
