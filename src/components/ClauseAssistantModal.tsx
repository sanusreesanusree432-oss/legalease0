import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, Loader2 } from 'lucide-react';
import { SectionClause } from '../types';

interface ClauseAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  clause: SectionClause | null;
  documentType: string;
  onApplyClause: (updatedClause: SectionClause) => void;
}

export const ClauseAssistantModal: React.FC<ClauseAssistantModalProps> = ({
  isOpen,
  onClose,
  clause,
  documentType,
  onApplyClause,
}) => {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [revisedClause, setRevisedClause] = useState<{
    revisedTitle: string;
    revisedContent: string;
    explanation?: string;
    riskNote?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !clause) return null;

  const quickPrompts = [
    'Make obligations strictly mutual between both parties',
    'Simplify to modern plain English while preserving legal enforceability',
    'Strengthen protection and add specific remedies for breach',
    'Add a standard 30-day notice and cure period',
    'Add a financial liability cap equal to total consideration paid in past 12 months',
    'Make term and renewal automatic unless 60 days advance notice is given',
  ];

  const handleRefine = async (customPrompt?: string) => {
    const promptToSend = customPrompt || instruction;
    if (!promptToSend.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/refine-clause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: clause.title,
          sectionContent: clause.content,
          instruction: promptToSend,
          documentType,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to refine clause');
      }

      setRevisedClause({
        revisedTitle: data.revisedTitle || clause.title,
        revisedContent: data.revisedContent || '',
        explanation: data.explanation,
        riskNote: data.riskNote,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with AI drafting assistant');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!revisedClause) return;
    onApplyClause({
      ...clause,
      title: revisedClause.revisedTitle,
      content: revisedClause.revisedContent,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">AI Clause Customizer & Assistant</h2>
              <p className="text-xs text-slate-400">
                Refine, clarify, or balance Section {clause.sectionNumber}: {clause.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Prompts */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Common Legal Adjustments
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInstruction(p);
                    handleRefine(p);
                  }}
                  disabled={loading}
                  className="px-2.5 py-1 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-md transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instruction Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Custom Instruction / Legal Intent
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                placeholder="e.g. Make termination notice 60 days and require certified mail delivery..."
                className="flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => handleRefine()}
                disabled={loading || !instruction.trim()}
                className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Side by Side Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Clause */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Current Draft Clause
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Original</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-serif flex-1 whitespace-pre-wrap">
                {clause.content}
              </p>
            </div>

            {/* Revised Clause */}
            <div className="p-4 rounded-lg bg-slate-950 border border-amber-500/40 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Refinement
                </span>
                {revisedClause && (
                  <span className="text-[11px] text-emerald-400 font-mono">Ready to Apply</span>
                )}
              </div>

              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-400 mb-2" />
                  <span className="text-xs">Drafting enforceable legal language...</span>
                </div>
              ) : revisedClause ? (
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-amber-100 leading-relaxed font-serif whitespace-pre-wrap">
                    {revisedClause.revisedContent}
                  </p>

                  {revisedClause.explanation && (
                    <div className="pt-2 border-t border-slate-850 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Rationale: </span>
                      {revisedClause.explanation}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center py-10 text-slate-500 text-xs text-center">
                  Select a common adjustment above or enter a custom instruction to see AI revision.
                </div>
              )}
            </div>
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

          {revisedClause && (
            <button
              onClick={handleApply}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              Apply to Document
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
