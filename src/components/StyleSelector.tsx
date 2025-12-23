import { useStore } from '../lib/store';
import type { HandwritingStyle } from '../types';

export default function StyleSelector() {
    const { handwritingStyle, setHandwritingStyle } = useStore();

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-ink-900 mb-2">
                Handwriting Style
            </label>
            <select
                value={handwritingStyle}
                onChange={(e) => setHandwritingStyle(e.target.value as HandwritingStyle)}
                className="input-base"
            >
                <option value="cursive">Cursive</option>
                <option value="script">Script</option>
                <option value="print">Print</option>
            </select>
        </div>
    );
}
