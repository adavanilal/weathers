import React, { useState, useEffect } from 'react';
import { User, Check, Sparkles, X, Camera } from 'lucide-react';
import { COOL_AVATARS } from '../constants/avatars';

export default function ProfileEditModal({
  isOpen,
  onClose,
  profileName,
  setProfileName,
  profileAvatar,
  setProfileAvatar,
  triggerToast,
}) {
  const [tempName, setTempName] = useState(profileName);
  const [selectedAvatar, setSelectedAvatar] = useState(profileAvatar);
  const [customUrl, setCustomUrl] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTempName(profileName);
      setSelectedAvatar(profileAvatar);
      setShowCustomInput(false);
      setCustomUrl('');
    }
  }, [isOpen, profileName, profileAvatar]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    if (e) e.preventDefault();
    const finalName = tempName.trim() ? tempName.trim() : 'Sky Explorer';
    const finalAvatar = selectedAvatar || profileAvatar;

    setProfileName(finalName);
    setProfileAvatar(finalAvatar);

    localStorage.setItem('aether_profile_name', finalName);
    localStorage.setItem('aether_profile_avatar', finalAvatar);

    if (triggerToast) {
      triggerToast(`Profile updated: ${finalName}`);
    }

    onClose();
  };

  const handleApplyCustomUrl = () => {
    if (customUrl.trim()) {
      setSelectedAvatar(customUrl.trim());
      setShowCustomInput(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101e33] border border-white/20 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scale-up text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Edit Profile</h3>
            <p className="text-xs text-slate-400">Change your display name and choose a cool avatar</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          {/* Active Avatar Preview */}
          <div className="flex items-center gap-4 bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-sky-400 shadow-lg shadow-sky-500/30 bg-[#162744] flex items-center justify-center">
                <img
                  src={selectedAvatar}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border border-[#101e33] flex items-center justify-center text-[10px]">
                ⚡
              </div>
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-semibold text-sky-300 uppercase tracking-wider">Live Preview</span>
              <h4 className="text-sm font-bold text-white truncate">{tempName || 'Enter name below'}</h4>
              <p className="text-xs text-slate-400">Personal Weather Station</p>
            </div>
          </div>

          {/* Profile Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Profile Display Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Your Name or Call Sign"
                maxLength={30}
                className="w-full bg-[#182a45] border border-white/15 focus:border-sky-400 pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition"
              />
            </div>
          </div>

          {/* Cool Avatar Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-sky-400" />
                <span>Choose Cool Avatar</span>
              </label>
              <button
                type="button"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-medium transition"
              >
                {showCustomInput ? 'Hide URL input' : 'Paste custom image URL'}
              </button>
            </div>

            {/* Custom URL Input (Optional) */}
            {showCustomInput && (
              <div className="mb-3 flex items-center gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="flex-1 bg-[#182a45] border border-white/15 focus:border-sky-400 px-3 py-1.5 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold text-white transition"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Avatars Grid */}
            <div className="grid grid-cols-4 gap-2.5 max-h-48 overflow-y-auto no-scrollbar pr-1">
              {COOL_AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.url;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.url)}
                    className={`relative p-1.5 rounded-2xl flex flex-col items-center gap-1 transition-all group ${
                      isSelected
                        ? 'bg-blue-600/35 border-2 border-sky-400 shadow-md shadow-sky-500/30'
                        : 'bg-white/5 border border-white/10 hover:border-sky-400/50 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#162744]">
                      <img
                        src={av.url}
                        alt={av.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-slate-300 group-hover:text-white truncate max-w-full">
                      {av.name}
                    </span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-sky-400 text-[#0c1a2e] flex items-center justify-center text-[10px] font-bold shadow">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-lg shadow-blue-500/25 transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
