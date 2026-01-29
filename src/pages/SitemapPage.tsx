import PageLayout from '../components/layout/PageLayout';
import { Link } from 'react-router-dom';
import { 
    Home, Info, Mail, HelpCircle, FileText, 
    Shield, Eye, Lock, Zap, BookOpen, 
    MessageSquare, RefreshCw 
} from 'lucide-react';

export default function SitemapPage() {
    const sections = [
        {
            title: "Product",
            links: [
                { name: "Home", path: "/", icon: Home },
                { name: "Features", path: "/features", icon: Zap },
                { name: "How It Works", path: "/how-it-works", icon: BookOpen },
            ]
        },
        {
            title: "Support",
            links: [
                { name: "About Us", path: "/about", icon: Info },
                { name: "Contact", path: "/contact", icon: Mail },
                { name: "Support Center", path: "/support", icon: MessageSquare },
                { name: "FAQ", path: "/faq", icon: HelpCircle },
                { name: "Changelog", path: "/changelog", icon: RefreshCw },
            ]
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", path: "/privacy", icon: Shield },
                { name: "Terms of Service", path: "/terms", icon: FileText },
                { name: "Disclaimer", path: "/disclaimer", icon: Eye },
                { name: "Cookie Policy", path: "/cookies", icon: Lock },
            ]
        }
    ];

    return (
        <PageLayout 
            title="Sitemap" 
            subtitle="An overview of all the pages on Handwritten. Find exactly what you're looking for."
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                {sections.map((section) => (
                    <div key={section.title} className="space-y-6">
                        <h2 className="text-xl font-display font-black uppercase tracking-widest text-neutral-400">
                            {section.title}
                        </h2>
                        <ul className="space-y-4">
                            {section.links.map((link) => (
                                <li key={link.path}>
                                    <Link 
                                        to={link.path} 
                                        className="flex items-center gap-4 group hover:bg-neutral-50 p-3 rounded-2xl transition-all border border-transparent hover:border-black/5"
                                    >
                                        <div className="w-10 h-10 bg-white shadow-sm border border-black/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <link.icon size={20} className="text-neutral-600" />
                                        </div>
                                        <span className="font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                                            {link.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <section className="p-8 border border-neutral-200 border-dashed rounded-3xl text-center bg-neutral-50/50">
                <h3 className="mt-0 text-neutral-900">Looking for something else?</h3>
                <p className="text-neutral-500 max-w-lg mx-auto mb-6">
                    If you can't find what you're looking for on this map, feel free to reach out to our support team.
                </p>
                <Link 
                    to="/support" 
                    className="inline-flex h-12 items-center justify-center px-8 rounded-full bg-neutral-900 text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-neutral-900/10"
                >
                    Contact Support
                </Link>
            </section>
        </PageLayout>
    );
}
