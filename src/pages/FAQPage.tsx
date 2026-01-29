import PageLayout from '../components/layout/PageLayout';

export default function FAQPage() {
    return (
        <PageLayout 
            title="Help Center" 
            subtitle="Frequently asked questions about Handwritten."
        >
                <section className="space-y-10">
                    <div>
                        <h4 className="text-xl font-bold text-neutral-900 mb-3 flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                             Is Handwritten really free?
                        </h4>
                        <p className="text-neutral-600 leading-relaxed">
                            Yes, the core text-to-handwriting features of Handwritten are completely free to use. We believe in providing accessible creative tools. While we may introduce premium templates or advanced AI features in the future, the essential conversion tools will always remain free.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold text-neutral-900 mb-3 flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                             How does the AI Humanizer work?
                        </h4>
                        <p className="text-neutral-600 leading-relaxed">
                            Our proprietary simulation engine goes beyond simple font replacement. It analyzes the context of your text and applies natural variations in letter spacing (kerning), baseline alignment (jitter), and stroke pressure. This mimicry of human biological imperfection is what gives the output its realistic, organic feel.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold text-neutral-900 mb-3 flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                             Is my data secure and private?
                        </h4>
                        <p className="text-neutral-600 leading-relaxed">
                            Absolutely. Privacy is built into our "Local-First" architecture. All text-to-handwriting processing and file exports happen directly within your browser's execution environment. We do not store, view, or transmit your personal notes or exported documents to any external servers.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold text-neutral-900 mb-3 flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                             Can I use my own handwriting font?
                        </h4>
                        <p className="text-neutral-600 leading-relaxed">
                            We currently provide a curated selection of highly optimized handwriting fonts. Support for custom font uploads (.ttf/.otf) is currently in development and will be released in a future update to allow users to create a truly one-to-one digital version of their own signature style.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold text-neutral-900 mb-3 flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                             What file formats are supported for export?
                        </h4>
                        <p className="text-neutral-600 leading-relaxed">
                            Handwritten supports high-definition PDF exports for multi-page documents, perfectly formatted for printing on A4 or Letter sizes. Additionally, you can export your work as a ZIP file containing individual high-quality PNG images for easy digital sharing.
                        </p>
                    </div>
                </section>
        </PageLayout>
    );
}
