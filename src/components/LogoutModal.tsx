'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Loader2 } from 'lucide-react';

type LogoutModalProps = {
  isOpen: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
};

export default function LogoutModal({ isOpen, onConfirm, onCancel }: LogoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleConfirm = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await onConfirm();
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={!isLoading ? onCancel : undefined}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-sm rounded-xl bg-[#1F2937]/90 backdrop-blur-sm border border-gray-800/50 shadow-xl"
            >
              <div className="p-6">
                <div className="flex flex-col items-center gap-4">
                  {/* Icon */}
                  <div className="rounded-full bg-red-500/10 p-3">
                    <LogOut className="w-6 h-6 text-red-500" />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Sign Out
                    </h3>
                    <p className="text-[#94A3B8] text-sm">
                      Are you sure you want to sign out? You'll need to sign in again to access your account.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 w-full mt-2">
                    <button
                      onClick={onCancel}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-[#94A3B8] hover:text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Signing out...
                        </>
                      ) : (
                        'Sign out'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
