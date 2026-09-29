import React, { useRef } from 'react';
import { X, Upload, Check, Image as ImageIcon } from 'lucide-react';
import { BrandingConfig } from '../types';
import { DEFAULT_LEGAL_SEAL } from '../data/presetScenarios';

interface BrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingConfig;
  setBranding: React.Dispatch<React.SetStateAction<BrandingConfig>>;
}

export const BrandingModal: React.FC<BrandingModalProps> = ({
  isOpen,
  onClose,
  branding,
  setBranding,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBranding((prev) => ({
            ...prev,
            logoUrl: event.target!.result as string,
            showSeal: true,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseDefaultSeal = () => {
    setBranding((prev) => ({
      ...prev,
      logoUrl: DEFAULT_LEGAL_SEAL,
      showSeal: true,
    }));
  };

  const colorOptions = [
    { label: 'Navy Blue', value: '#1e3a8a', bgClass: 'bg-blue-900' },
    { label: 'Deep Emerald', value: '#0f766e', bgClass: 'bg-teal-700' },
    { label: 'Royal Burgundy', value: '#831843', bgClass: 'bg-pink-900' },
    { label: 'Warm Amber', value: '#854d0e', bgClass: 'bg-amber-800' },
    { label: 'Charcoal Slate', value: '#0f172a', bgClass: 'bg-slate-900' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Custom Branding & Letterhead</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize company logos, typography, letterhead details, and official legal seals.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Logo / Seal Section */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Company Logo or Legal Seal
            </label>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-950 border border-slate-800">
              <div className="w-16 h-16 rounded-md bg-white border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {branding.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt="Brand Logo"
                    className="w-full h-full object-contain p-1"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Logo
                  </button>
                  <button
                    onClick={handleUseDefaultSeal}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
                  >
                    Use Legal Seal
                  </button>
                  {branding.logoUrl && (
                    <button
                      onClick={() => setBranding((prev) => ({ ...prev, logoUrl: null }))}
                      className="px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-md transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  PNG, JPG, or SVG. Automatically placed on document letterhead and export headers.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Letterhead Fields */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Letterhead Details
            </label>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Company / Firm Legal Name</span>
              <input
                type="text"
                value={branding.companyName}
                onChange={(e) => setBranding((prev) => ({ ...prev, companyName: e.target.value }))}
                placeholder="e.g. Acme Robotics Corp"
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Business Division / Practice Area Subtitle</span>
              <input
                type="text"
                value={branding.companySubtitle}
                onChange={(e) => setBranding((prev) => ({ ...prev, companySubtitle: e.target.value }))}
                placeholder="e.g. Technology & Intellectual Property Division"
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Registered Address / Contact Line</span>
              <input
                type="text"
                value={branding.companyAddress}
                onChange={(e) => setBranding((prev) => ({ ...prev, companyAddress: e.target.value }))}
                placeholder="e.g. 500 Market Street, Suite 400, San Francisco, CA 94105"
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Typography Choice */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Document Typography & Body Font
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBranding((prev) => ({ ...prev, fontFamily: 'serif' }))}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  branding.fontFamily === 'serif'
                    ? 'border-amber-500 bg-amber-950/20 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-serif text-base font-semibold text-amber-200">Newsreader</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Modern Editorial Serif</div>
              </button>

              <button
                type="button"
                onClick={() => setBranding((prev) => ({ ...prev, fontFamily: 'sans' }))}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  branding.fontFamily === 'sans'
                    ? 'border-amber-500 bg-amber-950/20 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-sans text-base font-semibold text-amber-200">Jakarta Sans</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Corporate Modern Sans</div>
              </button>

              <button
                type="button"
                onClick={() => setBranding((prev) => ({ ...prev, fontFamily: 'classic' }))}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  branding.fontFamily === 'classic'
                    ? 'border-amber-500 bg-amber-950/20 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-serif italic text-base font-semibold text-amber-200">Playfair</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Classic Legal Formal</div>
              </button>
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Branded Accent Color
            </label>
            <div className="flex items-center gap-3">
              {colorOptions.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setBranding((prev) => ({ ...prev, accentColor: c.value }))}
                  className={`w-9 h-9 rounded-full ${c.bgClass} flex items-center justify-center transition-transform ${
                    branding.accentColor === c.value ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-105'
                  }`}
                  title={c.label}
                >
                  {branding.accentColor === c.value && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Watermark Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Document Watermark
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['none', 'DRAFT', 'CONFIDENTIAL', 'EXECUTED'] as const).map((wm) => (
                <button
                  key={wm}
                  type="button"
                  onClick={() => setBranding((prev) => ({ ...prev, watermark: wm }))}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    branding.watermark === wm
                      ? 'border-amber-500 bg-amber-950/30 text-amber-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {wm === 'none' ? 'None' : wm}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
