import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto p-6 relative" onClick={e => e.stopPropagation()}>
                 <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:bg-gray-200">
                    <X className="w-6 h-6"/>
                 </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
