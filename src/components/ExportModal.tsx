import React, { useState } from 'react';
import {
  X,
  FileDown,
  Printer,
  FileText,
  Copy,
  Check,
  Loader2,
  FileCheck2,
} from 'lucide-react';
import { LegalDocument, BrandingConfig } from '../types';
import { exportToDocx } from '../utils/docxExport';
import { downloadPlainText, generatePlainText } from '../utils/textExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: LegalDocument;
  branding: BrandingConfig;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  document: docData,
  branding,
}) => {
  const [docxLoading, setDocxLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExportPDF = () => {
    // Triggers standard high-resolution print window configured with @media print in index.css
    window.print();
  };

  const handleExportDOCX = async () => {
    try {
      setDocxLoading(true);
      await exportToDocx(docData, branding);
    } catch (err) {
      console.error('Error generating DOCX:', err);
    } finally {
      setDocxLoading(false);
    }
  };

  const handleExportTXT = () => {
    downloadPlainText(docData, branding);
  };

  const handleCopyClipboard = () => {
    const text = generatePlainText(docData, branding);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Export Legal Document</h2>
              <p className="text-xs text-slate-400 font-mono text-[11px]">
                {docData.documentId} · {docData.documentType}
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

        {/* Export Options Grid */}
        <div className="p-6 space-y-3">
          {/* 1. PDF Export */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-colors flex items-center justify-between group">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-red-950/40 text-red-400 border border-red-900/60 mt-0.5">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                  Download as Branded PDF
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Formatted for Letter/A4 printing, including company letterhead, logo seal, and signature blocks.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              Export PDF
            </button>
          </div>

          {/* 2. DOCX Export */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-colors flex items-center justify-between group">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-blue-950/40 text-blue-400 border border-blue-900/60 mt-0.5">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                  Microsoft Word (.DOCX)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Native .docx file with formatted tables, headers, legal styles, and editable clauses.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportDOCX}
              disabled={docxLoading}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              {docxLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              Export DOCX
            </button>
          </div>

          {/* 3. Plain Text (.TXT) */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-colors flex items-center justify-between group">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                  Plain Text File (.TXT)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clean ASCII/UTF-8 legal transcript with standard paragraph indentation.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportTXT}
              className="px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Download TXT
            </button>
          </div>

          {/* 4. Copy to Clipboard */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-colors flex items-center justify-between group">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 mt-0.5">
                <Copy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                  Copy Entire Agreement
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Copy formatted contract text directly to clipboard for email or external editors.
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyClipboard}
              className="px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                'Copy Text'
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>All formatting & styling preserved</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
