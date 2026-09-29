import React, { useState } from 'react';
import { X, FolderOpen, Trash2, Copy, FileText, ArrowRight, Save, Clock } from 'lucide-react';
import { LegalDocument } from '../types';

interface SavedDraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDocument: LegalDocument;
  onLoadDraft: (doc: LegalDocument) => void;
  savedDrafts: LegalDocument[];
  onSaveCurrentAsDraft: () => void;
  onDeleteDraft: (id: string) => void;
  onDuplicateDraft: (doc: LegalDocument) => void;
}

export const SavedDraftsModal: React.FC<SavedDraftsModalProps> = ({
  isOpen,
  onClose,
  currentDocument,
  onLoadDraft,
  savedDrafts,
  onSaveCurrentAsDraft,
  onDeleteDraft,
  onDuplicateDraft,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = savedDrafts.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.documentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Document Drafts & Archive</h2>
              <p className="text-xs text-slate-400">
                Manage, duplicate, and switch between saved legal agreements.
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

        {/* Toolbar & Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, document ID, or type..."
            className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 flex-1"
          />

          <button
            onClick={onSaveCurrentAsDraft}
            className="px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 justify-center shrink-0 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            Save Current as Draft
          </button>
        </div>

        {/* Drafts List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              No matching drafts found. Click &quot;Save Current as Draft&quot; to save this document to your local archive.
            </div>
          ) : (
            filtered.map((draft) => {
              const isCurrent = draft.id === currentDocument.id;

              return (
                <div
                  key={draft.id}
                  className={`p-4 rounded-lg border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-amber-950/20 border-amber-500/50'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/60">
                        {draft.documentId}
                      </span>
                      <span className="text-xs text-slate-400 font-sans">
                        {draft.documentType}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                          Active In Editor
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-white truncate">{draft.title}</h4>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="truncate">
                        {draft.partiesSummary.partyA.name} ↔ {draft.partiesSummary.partyB.name}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(draft.updatedAt || draft.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onDuplicateDraft(draft)}
                      title="Duplicate this draft"
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteDraft(draft.id)}
                      title="Delete draft"
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {!isCurrent && (
                      <button
                        onClick={() => {
                          onLoadDraft(draft);
                          onClose();
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs text-slate-400">
          <span>Drafts are securely preserved in your local browser sandbox</span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
