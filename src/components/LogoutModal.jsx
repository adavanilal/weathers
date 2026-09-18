import React from 'react';
import { LogOut } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#101f35] border border-white/20 rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-scale-up">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
          <LogOut className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-white">Reset Session or Sign Out?</h3>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
          This will reset your currently active location and restore default preferences.
        </p>

        <div className="flex items-center justify-end gap-2.5 mt-5">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white shadow-lg transition"
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
}
