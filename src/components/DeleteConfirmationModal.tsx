'use client';

import { Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
}

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting, 
  title 
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] transition-opacity duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 relative border border-gray-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border-4 border-gray-900">
          <Trash2 className="w-8 h-8 text-white" />
        </div>
        
        <div className="mt-4 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Delete Analysis</h3>
          <p className="text-gray-400 text-sm mb-6">
            Are you sure you want to delete this analysis? This action cannot be undone.
          </p>
          <div className="text-gray-300 bg-gray-800/50 rounded-lg p-3 mb-6">
            <span className="line-clamp-1">{title}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors font-medium"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
