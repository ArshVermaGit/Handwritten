import PageLayout from '../components/layout/PageLayout';
import { Mail, Linkedin } from 'lucide-react';

export default function ContactPage() {
    return (
        <PageLayout 
            title="Contact Support" 
            subtitle="We're here to help you get the most out of Handwritten."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 not-prose">
                <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm text-center">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Mail size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Email Support</h3>
                    <p className="text-neutral-500 mb-6">For general inquiries, bugs, and feature requests.</p>
                    <a href="mailto:arshverma.dev@gmail.com" className="inline-block px-6 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
                        arshverma.dev@gmail.com
                    </a>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm text-center">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Linkedin size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">LinkedIn</h3>
                    <p className="text-neutral-500 mb-6">Connect with us on LinkedIn for professional updates.</p>
                    <a href="https://www.linkedin.com/in/arshvermadev/" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                        Arsh Verma (LinkedIn) →
                    </a>
                </div>
            </div>
            <h3>Frequently Asked Questions</h3>
            <p>
                Before reaching out, check our <a href="/faq">FAQ page</a> for answers to common questions about exports, fonts, and privacy.
            </p>
        </PageLayout>
    );
}
