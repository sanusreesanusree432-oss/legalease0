import React from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Palette,
  ShieldCheck,
  FolderOpen,
  Plus,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'editor' | 'generator' | 'compliance' | 'scenarios';
  setActiveTab: (tab: 'editor' | 'generator' | 'compliance' | 'scenarios') => void;
  onOpenBranding: () => void;
  onOpenExport: () => void;
  onOpenSavedDrafts: () => void;
  onNewDocument: () => void;
  documentTitle: string;
  hasUnsavedChanges?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBranding,
  onOpenExport,
  onOpenSavedDrafts,
  onNewDocument,
  documentTitle,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('scenarios')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-950/40">
              <span className="font-serif text-lg font-black tracking-tighter">§</span>
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                LegalEase
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-sans">
                AI Legal Studio
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links / Primary Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'scenarios'
                ? 'bg-slate-800 text-amber-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scenarios & Templates
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'generator'
                ? 'bg-slate-800 text-amber-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              AI Generator
            </span>
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'editor'
                ? 'bg-slate-800 text-amber-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-300" />
              Document Editor
            </span>
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'compliance'
                ? 'bg-slate-800 text-amber-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Risk & Audit
            </span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          {/* Saved Drafts */}
          <button
            onClick={onOpenSavedDrafts}
            title="Saved Drafts"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
          >
            <FolderOpen className="w-4 h-4" />
          </button>

          {/* Custom Branding */}
          <button
            onClick={onOpenBranding}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/80 whitespace-nowrap"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Branding</span>
          </button>

          {/* New Document */}
          <button
            onClick={onNewDocument}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/80 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-slate-300" />
            <span>New</span>
          </button>

          {/* Export Document */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm shadow-amber-950/30 transition-all whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export (.PDF / .DOCX)</span>
          </button>
        </div>
      </div>

      {/* Sub-header status bar showing document name */}
      <div className="bg-slate-950/80 border-t border-slate-850 px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 truncate max-w-xl">
          <span className="font-mono text-amber-400/90 text-[11px]">ACTIVE AGREEMENT:</span>
          <span className="text-slate-200 font-medium truncate">{documentTitle}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>Formatted & Verified</span>
          <span aria-hidden="true">·</span>
          <span>Editable In-line</span>
        </div>
      </div>
    </header>
  );
};
