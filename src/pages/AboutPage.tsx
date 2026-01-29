import PageLayout from '../components/layout/PageLayout';
import { Heart, Sparkles, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
    return (
        <PageLayout 
            title="About Handwritten" 
            subtitle="We're on a mission to preserve the beauty of human touch in a digital-first world."
            description="Discover the story behind Handwritten. Born from a student project at VIT Bhopal, we blend analog nostalgia with modern AI technology to bridge the gap in digital communication."
        >
            <div className="space-y-12">
                <section>
                    <h3 className="flex items-center gap-2">
                        <Sparkles className="text-amber-500" size={24} />
                        Our Vision
                    </h3>
                    <p>
                        In an era dominated by sterile digital fonts and instant messaging, we believe there's something irreplaceable about the unique character of a person's handwriting. Handwritten was born from the desire to bridge the gap between the warmth of analog expression and the efficiency of modern technology. Our goal is to make every digital communication feel as personal as a letter delivered by hand.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white/50 rounded-2xl border border-black/5 hover:border-black/10 transition-all group">
                        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Heart className="text-rose-500" size={24} />
                        </div>
                        <h4 className="font-bold text-lg mb-2">Human-Centric</h4>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            Every curve and slant in your handwriting tells a story. We focus on preserving that personal essence in every conversion.
                        </p>
                    </div>

                    <div className="p-6 bg-white/50 rounded-2xl border border-black/5 hover:border-black/10 transition-all group">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Shield className="text-blue-500" size={24} />
                        </div>
                        <h4 className="font-bold text-lg mb-2">Privacy First</h4>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            Your thoughts are private. Our local-first architecture ensures your data stays on your device, always.
                        </p>
                    </div>

                    <div className="p-6 bg-white/50 rounded-2xl border border-black/5 hover:border-black/10 transition-all group">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Zap className="text-amber-500" size={24} />
                        </div>
                        <h4 className="font-bold text-lg mb-2">AI Powered</h4>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            Leveraging state-of-the-art AI to humanize text while maintaining the authentic feel of a real hand-written note.
                        </p>
                    </div>
                </div>

                <section>
                    <h3>The Problem We're Solving</h3>
                    <p>
                        Digital communication often feels cold and impersonal. Whether it's a thank-you note, a personalized gift, or a heartfelt letter, some things are just better when they look like they were written by a human hand. Handwritten makes it possible to generate these personalized touches at scale without losing the soul of the message.
                    </p>
                </section>

                <section className="bg-neutral-900 text-white p-8 rounded-3xl">
                    <h3 className="text-white mt-0">Join our Journey</h3>
                    <p className="text-neutral-300">
                        We're constantly evolving and improving. If you have any suggestions or just want to say hi, feel free to reach out to us. We're building this for you.
                    </p>
                </section>
            </div>
        </PageLayout>
    );
}
