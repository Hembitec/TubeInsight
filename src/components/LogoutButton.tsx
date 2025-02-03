'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LogoutModal from './LogoutModal';

export default function LogoutButton() {
  const [showModal, setShowModal] = useState(false);
  const { signOut } = useAuth();

  const handleConfirm = async () => {
    await signOut();
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2.5 w-full rounded-lg text-sm font-medium text-[#94A3B8] hover:text-red-500 hover:bg-[#1F2937] transition-colors group"
      >
        <LogOut className="w-4 h-4 text-[#94A3B8] group-hover:text-red-500 transition-colors" />
        Sign out
      </button>

      <LogoutModal 
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
