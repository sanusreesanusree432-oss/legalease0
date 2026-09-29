import React, { useRef, useState, useEffect } from 'react';
import { X, Check, RotateCcw, PenTool, Type } from 'lucide-react';
import { PartyInfo } from '../types';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  party: PartyInfo | null;
  partyKey: 'partyA' | 'partyB';
  onSaveSignature: (partyKey: 'partyA' | 'partyB', signatureData: string, date: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  party,
  partyKey,
  onSaveSignature,
}) => {
  const [tab, setTab] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState<'cursive' | 'serif' | 'script'>('cursive');
  const [sigDate, setSigDate] = useState(new Date().toISOString().split('T')[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (party) {
      setTypedName(party.name || '');
    }
  }, [party]);

  useEffect(() => {
    if (isOpen && tab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
        }
      }
    }
  }, [isOpen, tab]);

  if (!isOpen || !party) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSave = () => {
    if (tab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) return;
      const dataUrl = canvas.toDataURL('image/png');
      onSaveSignature(partyKey, dataUrl, sigDate);
    } else {
      if (!typedName.trim()) return;
      // For typed signature, we can render to canvas or pass string format
      onSaveSignature(partyKey, `TYPED:${selectedFont}:${typedName.trim()}`, sigDate);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Execute Document Signature</h2>
            <p className="text-xs text-slate-400">
              Sign as <span className="text-amber-400 font-medium">{party.name}</span> ({party.role})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 pt-2">
          <button
            onClick={() => setTab('draw')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              tab === 'draw'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            Draw Signature
          </button>
          <button
            onClick={() => setTab('type')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              tab === 'type'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            Type Legal Signature
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {tab === 'draw' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400">Use mouse or finger to draw in signature box</span>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-300 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear Pad
                </button>
              </div>

              <div className="border border-slate-700 rounded-lg bg-white overflow-hidden relative shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[150px] cursor-crosshair touch-none"
                />
                <div className="absolute bottom-3 left-4 right-4 border-b border-dashed border-slate-300 pointer-events-none flex justify-between text-[10px] text-slate-400">
                  <span>Sign on line</span>
                  <span>Authentic Digital Execution</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Enter full legal name"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Signature Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cursive', label: 'Flowing Script', style: 'font-serif italic text-lg' },
                    { id: 'serif', label: 'Classic Formal', style: 'font-serif tracking-widest text-sm' },
                    { id: 'script', label: 'Expressive Handwriting', style: 'italic text-base' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedFont(s.id as any)}
                      className={`p-2.5 rounded-lg border text-center transition-colors ${
                        selectedFont === s.id
                          ? 'border-amber-500 bg-amber-950/20 text-amber-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-[11px] text-slate-500 mb-1">{s.label}</div>
                      <div className={s.style}>{typedName || 'Signature'}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Box */}
              <div className="p-4 bg-white rounded-lg border border-slate-700 shadow-inner flex flex-col justify-end min-h-[90px]">
                <div
                  className={`text-slate-900 ${
                    selectedFont === 'cursive'
                      ? 'font-serif italic text-2xl tracking-wide'
                      : selectedFont === 'serif'
                      ? 'font-serif text-lg tracking-widest uppercase'
                      : 'italic text-xl'
                  }`}
                >
                  {typedName || 'Your Signature'}
                </div>
                <div className="mt-2 border-t border-slate-300 pt-1 text-[10px] text-slate-500 flex justify-between">
                  <span>Digitally Authorized Signature</span>
                  <span>LegalEase Verified</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Execution Date
            </label>
            <input
              type="date"
              value={sigDate}
              onChange={(e) => setSigDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={tab === 'draw' ? !hasDrawn : !typedName.trim()}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            Apply Signature
          </button>
        </div>
      </div>
    </div>
  );
};
