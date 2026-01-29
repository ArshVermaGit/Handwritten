import PageLayout from '../components/layout/PageLayout';
import { MousePointer2, Settings2, Share2, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
    return (
        <PageLayout 
            title="How It Works" 
            subtitle="Three simple steps to transform your digital text into analog beauty."
            description="Learn how to use Handwritten's text-to-handwriting tool. Paste your text, customize your style with AI humanization, and export high-quality documents instantly."
        >

            <div className="space-y-20">
                <section className="prose prose-neutral max-w-none">
                    <p className="lead">
                        Our platform is designed for simplicity without compromising on power. Whether you're a student, a creative professional, or someone who just appreciates a personal touch, here is how you can get started.
                    </p>
                </section>
                <div className="grid grid-cols-1 gap-12">
                    <div className="flex flex-col md:flex-row items-center gap-12 group">
                        <div className="w-20 h-20 bg-neutral-900 text-white rounded-4xl flex items-center justify-center shrink-0 text-3xl font-black shadow-xl shadow-neutral-900/10">1</div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-indigo-600 font-black tracking-widest uppercase text-xs">
                                <MousePointer2 size={16} />
                                Step One
                            </div>
                            <h3 className="text-3xl font-bold text-neutral-900">Write or Paste Your Text</h3>
                            <p className="text-lg text-neutral-600 max-w-2xl leading-relaxed">
                                Simply start typing in our focused editor or paste your existing notes. We support markdown, bullet points, and complex formatting.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row-reverse items-center gap-12 group text-right md:text-left">
                        <div className="w-20 h-20 bg-indigo-600 text-white rounded-4xl flex items-center justify-center shrink-0 text-3xl font-black shadow-xl shadow-indigo-600/10">2</div>
                        <div className="space-y-4 flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-3 text-indigo-600 font-black tracking-widest uppercase text-xs">
                                <Settings2 size={16} />
                                Step Two
                            </div>
                            <h3 className="text-3xl font-bold text-neutral-900">Personalize Your Style</h3>
                            <p className="text-lg text-neutral-600 max-w-2xl leading-relaxed">
                                Adjust the font, size, ink color, and paper type. Use the AI Humanizer to add subtle, realistic variations to the output.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-12 group">
                        <div className="w-20 h-20 bg-emerald-500 text-white rounded-4xl flex items-center justify-center shrink-0 text-3xl font-black shadow-xl shadow-emerald-500/10">3</div>
                        <div className="space-y-4 text-center md:text-left">
                            <div className="flex items-center gap-3 text-indigo-600 font-black tracking-widest uppercase text-xs justify-center md:justify-start">
                                <Share2 size={16} />
                                Step Three
                            </div>
                            <h3 className="text-3xl font-bold text-neutral-900">Export and Share</h3>
                            <p className="text-lg text-neutral-600 max-w-2xl leading-relaxed">
                                Review your pages in the live preview and export them as a multi-page PDF or a ZIP of images. Ready for any platform.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    <a href="/" className="group flex items-center gap-3 px-10 py-5 bg-neutral-900 text-white rounded-4xl font-black text-lg hover:shadow-2xl hover:bg-black transition-all hover:scale-105 active:scale-95">
                        Start Creating Now
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </PageLayout>
    );
}
