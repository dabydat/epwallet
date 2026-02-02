import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
}

export function Modal({ title, children, onClose }: ModalProps) {
    return (
        <div className="fixed -inset-4 z-[9999] flex items-center justify-center p-4 bg-slate-100/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
