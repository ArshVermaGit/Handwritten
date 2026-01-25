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
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        ref={modalRef}
                        className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl max-w-4xl w-full relative flex flex-col h-[85vh] border border-white/20"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-neutral-100 flex items-center justify-between bg-white relative z-10 shrink-0">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm border border-indigo-100">
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-display font-bold text-neutral-900 leading-tight">History Vault</h2>
                                    <p className="text-sm text-neutral-400 font-medium">Manage your exported masterpieces</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {/* Search Bar */}
                                <div className="hidden sm:flex items-center gap-3 px-4 py-3 bg-neutral-50 rounded-2xl border border-neutral-100 focus-within:border-indigo-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all w-64">
                                    <Search size={18} className="text-neutral-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search files..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-neutral-400 text-neutral-900" 
                                    />
                                </div>

                                <button 
                                    onClick={onClose}
                                    className="p-3 text-neutral-300 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Grid Content */}
                        <div className="flex-1 overflow-y-auto p-8 bg-[#FAFAFA] scrollbar-hide relative">
                            {/* Grid Background Pattern */}
                            <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full opacity-30">
                                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                                    <p className="font-bold tracking-widest uppercase text-xs">Loading Vault...</p>
                                </div>
                            ) : filteredFiles.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm border border-neutral-100 flex items-center justify-center mb-6">
                                        <Package size={48} className="text-neutral-200" />
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                                        {searchQuery ? 'No matches found' : 'Your vault is empty'}
                                    </h3>
                                    <p className="text-neutral-400 leading-relaxed max-w-xs mx-auto text-sm">
                                        {searchQuery ? `We couldn't find any files matching "${searchQuery}"` : "Exports will be safely stored here locally."}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10 pb-0">
                                    {filteredFiles.map((file, index) => (
                                        <motion.div 
                                            layout
                                            key={file.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl border border-neutral-100 hover:border-indigo-100 transition-all duration-300 relative overflow-hidden"
                                        >
                                            {/* Hover Overlay Actions */}
                                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex items-center justify-center gap-3">
                                                <button 
                                                    onClick={() => handleDownload(file)}
                                                    className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-transform"
                                                    title="Download"
                                                >
                                                    <Download size={24} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(file.id)}
                                                    className="p-4 bg-white text-rose-500 border border-rose-100 rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-transform hover:bg-rose-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={24} />
                                                </button>
                                            </div>

                                            {/* Card Content */}
                                            <div className="aspect-[4/3] bg-neutral-50 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:bg-indigo-50/30 transition-colors">
                                                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${
                                                     file.type === 'pdf' ? 'bg-rose-100 text-rose-500' : 'bg-blue-100 text-blue-500'
                                                 }`}>
                                                     {file.type === 'pdf' ? <FileText size={32} /> : <Package size={32} />}
                                                 </div>
                                                 <div className="absolute top-3 right-3 px-2 py-1 bg-white/80 backdrop-blur rounded-lg text-[10px] font-black uppercase tracking-wider text-neutral-400 border border-neutral-100">
                                                     {file.type.toUpperCase()}
                                                 </div>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-neutral-900 truncate mb-1" title={file.name}>
                                                    {file.name}
                                                </h4>
                                                <div className="flex items-center gap-3 text-xs font-medium text-neutral-400">
                                                    <span>{formatSize(file.size)}</span>
                                                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                                                    <span>{formatDate(file.timestamp)}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Info */}
                        <div className="p-5 bg-white border-t border-neutral-100 shrink-0">
                            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <span>Encrypted Local Storage</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
