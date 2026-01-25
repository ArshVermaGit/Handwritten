import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Download, Trash2, FileText, Package, ShieldCheck, Search } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { getAllExportedFiles, deleteExportedFile, type StoredFile } from '../lib/fileStorage';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
    const [files, setFiles] = useState<StoredFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { addToast } = useToast();
    const modalRef = useRef<HTMLDivElement>(null);

    const loadFiles = useCallback(async () => {
        setIsLoading(true);
        try {
            const storedFiles = await getAllExportedFiles();
            setFiles(storedFiles);
        } catch (err) {
            console.error('Failed to load history:', err);
            addToast('Failed to load history', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        if (isOpen) {
            loadFiles();
        }
    }, [isOpen, loadFiles]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleDownload = (file: StoredFile) => {
        const url = URL.createObjectURL(file.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        addToast('Download started', 'success');
    };

    const handleDelete = async (id: string) => {
        if (confirm('Permanently delete this file from your local history?')) {
            try {
                await deleteExportedFile(id);
                setFiles(prev => prev.filter(f => f.id !== id));
                addToast('File deleted', 'info');
            } catch {
                addToast('Delete failed', 'error');
            }
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
        });
    };

    const filteredFiles = files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xl"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        ref={modalRef}
                        className="bg-white rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] max-w-5xl w-full relative flex flex-col max-h-[90vh] border border-white/20 z-10 overflow-hidden"
                    >
                        {/* Header Section */}
                        <div className="p-8 pb-6 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 ring-4 ring-indigo-50">
                                    <Clock size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-display font-black text-neutral-900 tracking-tight leading-none mb-2">Vault History</h2>
                                    <p className="text-sm text-neutral-400 font-semibold uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                        Secure Local Storage
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex flex-1 max-w-md items-center gap-4">
                                <div className="flex-1 flex items-center gap-3 px-5 py-4 bg-neutral-50 rounded-2xl border border-neutral-100 focus-within:border-indigo-500 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] transition-all">
                                    <Search size={20} className="text-neutral-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Find a masterpiece..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent border-none outline-none text-base w-full font-medium placeholder:text-neutral-300 text-neutral-900" 
                                    />
                                </div>

                                <button 
                                    onClick={onClose}
                                    className="p-4 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-2xl transition-all"
                                >
                                    <X size={28} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-8 pt-4 bg-[#F8F9FB] custom-scrollbar">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-64 grayscale opacity-50">
                                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                                    <p className="font-black tracking-[0.2em] uppercase text-[10px] text-neutral-400">Synchronizing Vault</p>
                                </div>
                            ) : filteredFiles.length === 0 ? (
                                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                                    <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-sm border border-neutral-100 flex items-center justify-center mb-8">
                                        <Package size={56} className="text-neutral-100" />
                                    </div>
                                    <h3 className="text-2xl font-black text-neutral-900 mb-3">
                                        {searchQuery ? 'Missing Masterpiece' : 'Vault Quiet'}
                                    </h3>
                                    <p className="text-neutral-400 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                                        {searchQuery ? `No signals found for "${searchQuery}"` : "Your future legendary exports will safely settle here."}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                                    {filteredFiles.map((file, index) => (
                                        <motion.div 
                                            layout
                                            key={file.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                            className="group bg-white rounded-[2rem] p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] border border-neutral-100 hover:border-indigo-100 transition-all duration-500 relative flex flex-col"
                                        >
                                            {/* Preview Context / Icon */}
                                            <div className={`aspect-[16/9] rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${
                                                file.type === 'pdf' ? 'bg-rose-50' : 'bg-blue-50'
                                            }`}>
                                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-500 ${
                                                    file.type === 'pdf' ? 'bg-white text-rose-500' : 'bg-white text-blue-500'
                                                }`}>
                                                    {file.type === 'pdf' ? <FileText size={40} strokeWidth={1.5} /> : <Package size={40} strokeWidth={1.5} />}
                                                </div>
                                                
                                                <div className="absolute top-4 left-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        file.type === 'pdf' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
                                                    }`}>
                                                        {file.type}
                                                    </span>
                                                </div>

                                                {/* Hidden Actions - Overloaded for UX */}
                                                <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                                    <button 
                                                        onClick={() => handleDownload(file)}
                                                        className="p-5 bg-white text-neutral-900 rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all"
                                                    >
                                                        <Download size={24} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(file.id)}
                                                        className="p-5 bg-rose-500 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all hover:bg-rose-600"
                                                    >
                                                        <Trash2 size={24} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="font-bold text-neutral-900 truncate mb-1 text-lg group-hover:text-indigo-600 transition-colors" title={file.name}>
                                                    {file.name}
                                                </h4>
                                                <div className="flex items-center gap-3 text-xs font-bold text-neutral-400 uppercase tracking-widest opacity-80">
                                                    <span>{formatSize(file.size)}</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                                                    <span>{formatDate(file.timestamp)}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Secure Bottom Bar */}
                        <div className="px-8 py-5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>End-to-End Client Security</span>
                            </div>
                            <p className="text-[10px] font-black text-neutral-300 uppercase underline decoration-neutral-200 underline-offset-4 decoration-2">
                                Data never leaves your machine
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
