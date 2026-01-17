/**
 * Background worker for heavy text processing and batch operations
 */

self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;

    switch (type) {
        case 'PROCESS_TEXT': {
            // Heavy transformation logic
            const processed = payload.text.split('\n').map((line: string) => {
                // Example heavy operation: complex regex or simulation
                return line.trim();
            }).join('\n');
            self.postMessage({ type: 'SUCCESS', payload: processed });
            break;
        }

        case 'BATCH_EXPORT_PREP': {
            // Logic to prepare multiple pages for export
            // This could involve generating data URLs for 100s of pages
            self.postMessage({ type: 'PROGRESS', payload: 50 });
            self.postMessage({ type: 'SUCCESS', payload: 'ready' });
            break;
        }

        default:
            self.postMessage({ type: 'ERROR', payload: 'Unknown command' });
    }
};
