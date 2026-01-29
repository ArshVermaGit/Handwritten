import PageLayout from '../components/layout/PageLayout';
import { Sparkles, Download, Layout, PenTool } from 'lucide-react';

export default function FeaturesPage() {
    return (
        <PageLayout 
            title="Features" 
            subtitle="Everything you need to create perfect digital handwriting."
            description="Explore the advanced features of Handwritten: AI humanizer, infinite font variety, high-resolution PDF export, and smart layout engine."
        >

            <div className="space-y-16">
                <section className="prose prose-neutral max-w-none">
                    <p className="lead">
                        Handwritten is more than just a font generator. It's a comprehensive tool designed to mimic the complexity and charm of human penmanship using state-of-the-art simulation technology.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/50 rounded-3xl border border-black/5 hover:shadow-premium transition-all group">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles className="text-indigo-600" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">AI Humanizer</h3>
                        <p className="text-neutral-600 leading-relaxed">
                            Our advanced AI analyzes your text and applies natural variations in letter spacing, slant, and baseline drift to simulate the organic feel of real handwriting.
                        </p>
                    </div>

                    <div className="p-8 bg-white/50 rounded-3xl border border-black/5 hover:shadow-premium transition-all group">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <PenTool className="text-amber-600" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Infinite Variety</h3>
                        <p className="text-neutral-600 leading-relaxed">
                            Choose from a wide range of hand-crafted fonts, or upload your own to create a truly unique signature style for every document.
                        </p>
                    </div>

                    <div className="p-8 bg-white/50 rounded-3xl border border-black/5 hover:shadow-premium transition-all group">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Download className="text-emerald-600" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">High-Resolution Export</h3>
                        <p className="text-neutral-600 leading-relaxed">
                            Export your creations in high-quality PDF or image formats, ready for printing or digital sharing with zero loss in quality.
                        </p>
                    </div>

                    <div className="p-8 bg-white/50 rounded-3xl border border-black/5 hover:shadow-premium transition-all group">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Layout className="text-blue-600" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Smart Layout</h3>
                        <p className="text-neutral-600 leading-relaxed">
                            Automatic margin handling, line spacing, and page breaks ensure your letters look professional and perfectly aligned every time.
                        </p>
                    </div>
                </div>

                <section className="bg-neutral-900 text-white p-12 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-4">Ready to experience it?</h3>
                            <p className="text-neutral-400 max-w-md">
                                Start creating your first handwritten masterpiece today with our intuitive editor.
                            </p>
                        </div>
                        <a href="/" className="px-8 py-4 bg-white text-neutral-900 rounded-2xl font-bold hover:scale-105 transition-transform">
                            Get Started Free
                        </a>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}
