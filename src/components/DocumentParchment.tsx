import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  Edit2,
  FileCheck,
  SplitSquareVertical,
} from 'lucide-react';
import { LegalDocument, BrandingConfig, SectionClause, TermTableItem } from '../types';

interface DocumentParchmentProps {
  document: LegalDocument;
  branding: BrandingConfig;
  onUpdateDocument: (updated: LegalDocument) => void;
  onOpenClauseAssistant: (clause: SectionClause) => void;
  onOpenSignatureModal: (partyKey: 'partyA' | 'partyB') => void;
}

export const DocumentParchment: React.FC<DocumentParchmentProps> = ({
  document,
  branding,
  onUpdateDocument,
  onOpenClauseAssistant,
  onOpenSignatureModal,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [pageViewMode, setPageViewMode] = useState<'continuous' | 'pages'>('continuous');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingTermIndex, setEditingTermIndex] = useState<number | null>(null);
  const [editingRecitalIndex, setEditingRecitalIndex] = useState<number | null>(null);

  // Handlers for modifying document sections
  const handleUpdateSectionContent = (id: string, newContent: string) => {
    const updated = {
      ...document,
      sections: document.sections.map((s) =>
        s.id === id ? { ...s, content: newContent } : s
      ),
      updatedAt: new Date().toISOString(),
    };
    onUpdateDocument(updated);
  };

  const handleUpdateSectionTitle = (id: string, newTitle: string) => {
    const updated = {
      ...document,
      sections: document.sections.map((s) =>
        s.id === id ? { ...s, title: newTitle } : s
      ),
      updatedAt: new Date().toISOString(),
    };
    onUpdateDocument(updated);
  };

  const handleDeleteSection = (id: string) => {
    if (document.sections.length <= 1) return;
    const updated = {
      ...document,
      sections: document.sections
        .filter((s) => s.id !== id)
        .map((s, idx) => ({ ...s, sectionNumber: (idx + 1).toString() })),
      updatedAt: new Date().toISOString(),
    };
    onUpdateDocument(updated);
  };

  const handleAddSection = () => {
    const newSecNum = (document.sections.length + 1).toString();
    const newSection: SectionClause = {
      id: `sec-${Date.now()}`,
      sectionNumber: newSecNum,
      title: 'SPECIAL COVENANTS AND PROVISIONS',
      content:
        'The parties hereby agree to the following additional covenants, obligations, and terms as mutually stipulated.',
      subclauses: [],
      standard: false,
      category: 'Custom',
    };
    const updated = {
      ...document,
      sections: [...document.sections, newSection],
      updatedAt: new Date().toISOString(),
    };
    onUpdateDocument(updated);
    setEditingSectionId(newSection.id);
  };

  const handleAddSubclause = (sectionId: string) => {
    const section = document.sections.find((s) => s.id === sectionId);
    if (!section) return;
    const currentSubs = section.subclauses || [];
    const subNum = `${section.sectionNumber}.${currentSubs.length + 1}`;
    const newSubs = [...currentSubs, `${subNum} Additional stipulation: specify requirements and timeline.`];

    const updated = {
      ...document,
      sections: document.sections.map((s) =>
        s.id === sectionId ? { ...s, subclauses: newSubs } : s
      ),
      updatedAt: new Date().toISOString(),
    };
    onUpdateDocument(updated);
  };

  // Term Table editing
  const handleUpdateTerm = (index: number, field: 'label' | 'value', val: string) => {
    const newTable = [...document.termTable];
    newTable[index] = { ...newTable[index], [field]: val };
    onUpdateDocument({
      ...document,
      termTable: newTable,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddTerm = () => {
    const newTerm: TermTableItem = {
      label: 'Special Provision',
      value: 'Agreed specification',
      category: 'General',
    };
    onUpdateDocument({
      ...document,
      termTable: [...document.termTable, newTerm],
      updatedAt: new Date().toISOString(),
    });
    setEditingTermIndex(document.termTable.length);
  };

  const handleDeleteTerm = (index: number) => {
    const newTable = document.termTable.filter((_, i) => i !== index);
    onUpdateDocument({
      ...document,
      termTable: newTable,
      updatedAt: new Date().toISOString(),
    });
  };

  // Recitals editing
  const handleUpdateRecital = (index: number, text: string) => {
    const newRecitals = [...document.recitals];
    newRecitals[index] = text;
    onUpdateDocument({
      ...document,
      recitals: newRecitals,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddRecital = () => {
    onUpdateDocument({
      ...document,
      recitals: [
        ...document.recitals,
        'WHEREAS, the parties desire to incorporate these mutual covenants into this binding Agreement;',
      ],
      updatedAt: new Date().toISOString(),
    });
  };

  // Typography font class
  const getFontFamilyClass = () => {
    if (branding.fontFamily === 'serif') return 'font-serif';
    if (branding.fontFamily === 'sans') return 'font-sans';
    return 'font-serif'; // classic default
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Floating Canvas Controls */}
      <div className="sticky top-24 z-30 mb-6 flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl shadow-xl text-slate-300 text-xs">
        <div className="flex items-center gap-1 border-r border-slate-800 pr-2">
          <button
            onClick={() => setZoom((prev) => Math.max(75, prev - 10))}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] px-1 text-amber-400 tabular-nums">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((prev) => Math.min(130, prev + 10))}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r border-slate-800 pr-2">
          <button
            onClick={() => setPageViewMode('continuous')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              pageViewMode === 'continuous'
                ? 'bg-slate-800 text-amber-300 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Continuous
          </button>
          <button
            onClick={() => setPageViewMode('pages')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              pageViewMode === 'pages'
                ? 'bg-slate-800 text-amber-300 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1">
              <SplitSquareVertical className="w-3.5 h-3.5" />
              Page Breaks
            </span>
          </button>
        </div>

        <button
          onClick={handleAddSection}
          className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Section
        </button>
      </div>

      {/* Parchment Wrapper with Zoom scale */}
      <div
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        className="transition-transform duration-150 w-full max-w-[850px]"
      >
        {/* The Legal Parchment Document (Target for Print/PDF) */}
        <div
          id="legal-document-parchment"
          className={`relative w-full bg-white text-stone-900 shadow-2xl rounded-sm border border-stone-200 p-8 sm:p-14 md:p-16 ${getFontFamilyClass()} transition-all`}
        >
          {/* Watermark Overlay */}
          {branding.watermark !== 'none' && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-10 select-none">
              <span className="transform -rotate-45 text-7xl md:text-8xl font-black tracking-widest text-stone-900/[0.04] uppercase font-sans">
                {branding.watermark}
              </span>
            </div>
          )}

          {/* Letterhead & Branding Header */}
          {branding.includeHeaderFooter && (
            <div className="border-b-2 border-stone-300 pb-6 mb-8 flex items-center justify-between gap-6">
              <div className="flex-1">
                {branding.companyName ? (
                  <h1
                    style={{ color: branding.accentColor }}
                    className="text-lg md:text-xl font-bold uppercase tracking-tight"
                  >
                    {branding.companyName}
                  </h1>
                ) : (
                  <h1 className="text-lg font-bold uppercase tracking-tight text-stone-800">
                    LegalEase Document Services
                  </h1>
                )}
                {branding.companySubtitle && (
                  <p className="text-xs text-stone-600 italic mt-0.5">
                    {branding.companySubtitle}
                  </p>
                )}
                {branding.companyAddress && (
                  <p className="text-[11px] text-stone-500 mt-1">
                    {branding.companyAddress}
                  </p>
                )}
              </div>

              {/* Logo / Seal */}
              {branding.showSeal && branding.logoUrl && (
                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center p-1 rounded-sm border border-stone-200 bg-stone-50/50 shadow-xs">
                  <img
                    src={branding.logoUrl}
                    alt="Corporate Seal"
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          )}

          {/* Document Title Header */}
          <div className="text-center my-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-stone-900 uppercase">
              {document.title}
            </h2>
            <div className="mt-2 text-xs text-stone-500 flex items-center justify-center gap-2 flex-wrap font-sans">
              <span className="font-mono text-stone-600 font-semibold">{document.documentId}</span>
              <span>·</span>
              <span>Effective: <strong className="text-stone-800">{document.effectiveDate}</strong></span>
              <span>·</span>
              <span>Governing: <strong className="text-stone-800">{document.jurisdiction}</strong></span>
            </div>
          </div>

          {/* Automated Key Terms Summary Table */}
          <div className="my-8 rounded-sm border border-stone-300 bg-stone-50/60 overflow-hidden shadow-xs">
            <div className="bg-stone-200/70 px-4 py-2 flex items-center justify-between border-b border-stone-300">
              <div className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-stone-700" />
                <span className="text-xs font-bold tracking-wider uppercase text-stone-800 font-sans">
                  Automated Key Terms Summary Table
                </span>
              </div>
              <button
                onClick={handleAddTerm}
                className="text-[11px] text-stone-600 hover:text-stone-900 flex items-center gap-1 font-sans"
              >
                <Plus className="w-3 h-3" /> Add Term
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-stone-800 font-sans">
                <thead className="text-[11px] uppercase bg-stone-100/80 text-stone-600 border-b border-stone-200">
                  <tr>
                    <th scope="col" className="px-4 py-2 w-1/3 font-semibold">
                      Key Term / Provision
                    </th>
                    <th scope="col" className="px-4 py-2 font-semibold">
                      Agreed Term Specification
                    </th>
                    <th scope="col" className="px-2 py-2 w-8 text-center print:hidden"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/80">
                  {document.termTable.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/80 transition-colors group">
                      <td className="px-4 py-2.5 font-medium text-stone-700 align-top">
                        {editingTermIndex === idx ? (
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => handleUpdateTerm(idx, 'label', e.target.value)}
                            onBlur={() => setEditingTermIndex(null)}
                            autoFocus
                            className="w-full px-1.5 py-0.5 border border-stone-300 rounded text-xs bg-white"
                          />
                        ) : (
                          <span
                            onClick={() => setEditingTermIndex(idx)}
                            className="cursor-pointer hover:underline"
                            title="Click to edit term label"
                          >
                            {item.label}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-stone-900 font-mono text-[11px] align-top">
                        {editingTermIndex === idx ? (
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => handleUpdateTerm(idx, 'value', e.target.value)}
                            onBlur={() => setEditingTermIndex(null)}
                            className="w-full px-1.5 py-0.5 border border-stone-300 rounded text-xs bg-white font-sans"
                          />
                        ) : (
                          <span
                            onClick={() => setEditingTermIndex(idx)}
                            className="cursor-pointer hover:bg-stone-200/50 rounded px-1 py-0.5 transition-colors block"
                            title="Click to edit specification"
                          >
                            {item.value}
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-2.5 text-center align-top print:hidden">
                        <button
                          onClick={() => handleDeleteTerm(idx)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity"
                          title="Remove term"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Parties Preamble */}
          <div className="my-6 text-sm leading-relaxed text-stone-800 space-y-2">
            <p>
              <strong>THIS AGREEMENT</strong> is made and entered into on this{' '}
              <strong className="underline decoration-stone-400 underline-offset-2">
                {document.effectiveDate}
              </strong>{' '}
              (the &quot;Effective Date&quot;), by and between:
            </p>
            <div className="pl-4 border-l-2 border-stone-300 space-y-2 my-3">
              <div>
                <strong className="text-stone-900">
                  {document.partiesSummary.partyA.role}:
                </strong>{' '}
                <span className="font-semibold">{document.partiesSummary.partyA.name}</span>
                {document.partiesSummary.partyA.details && (
                  <span className="text-stone-600 block text-xs">
                    {document.partiesSummary.partyA.details}
                  </span>
                )}
              </div>
              <div>
                <strong className="text-stone-900">
                  {document.partiesSummary.partyB.role}:
                </strong>{' '}
                <span className="font-semibold">{document.partiesSummary.partyB.name}</span>
                {document.partiesSummary.partyB.details && (
                  <span className="text-stone-600 block text-xs">
                    {document.partiesSummary.partyB.details}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Recitals (WHEREAS Clauses) */}
          {document.recitals && document.recitals.length > 0 && (
            <div className="my-6 space-y-2 text-xs md:text-sm text-stone-700 italic leading-relaxed">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-stone-900 text-xs font-sans not-italic">
                  Recitals
                </span>
                <button
                  onClick={handleAddRecital}
                  className="text-[11px] text-stone-500 hover:text-stone-900 font-sans not-italic print:hidden flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Recital
                </button>
              </div>

              {document.recitals.map((recital, rIdx) => (
                <div key={rIdx} className="group relative pl-2 hover:bg-stone-50 rounded transition-colors">
                  {editingRecitalIndex === rIdx ? (
                    <textarea
                      value={recital}
                      onChange={(e) => handleUpdateRecital(rIdx, e.target.value)}
                      onBlur={() => setEditingRecitalIndex(null)}
                      autoFocus
                      rows={2}
                      className="w-full text-xs p-2 border border-stone-300 rounded font-serif italic bg-white"
                    />
                  ) : (
                    <p
                      onClick={() => setEditingRecitalIndex(rIdx)}
                      className="cursor-pointer py-1"
                      title="Click to edit recital"
                    >
                      {recital}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="my-8 border-t border-stone-300 flex items-center justify-center">
            <span className="bg-white px-3 text-[11px] uppercase tracking-widest text-stone-400 font-sans">
              Terms & Covenants
            </span>
          </div>

          {/* Numbered Sections */}
          <div className="space-y-8">
            {document.sections.map((section, sIdx) => {
              const isEditing = editingSectionId === section.id;

              return (
                <div
                  key={section.id}
                  className={`relative group p-4 -mx-4 rounded-lg transition-colors ${
                    isEditing ? 'bg-amber-50/40 ring-1 ring-amber-300' : 'hover:bg-stone-50/70'
                  } ${pageViewMode === 'pages' && sIdx > 0 && sIdx % 4 === 0 ? 'break-before-page pt-12 border-t-2 border-dashed border-stone-300' : ''}`}
                >
                  {/* Action Toolbar on Clause (Hover or active) */}
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 print:hidden bg-white/95 shadow-xs border border-stone-200 px-2 py-1 rounded-md z-20">
                    <button
                      type="button"
                      onClick={() => onOpenClauseAssistant(section)}
                      className="flex items-center gap-1 text-[11px] font-sans font-semibold text-amber-700 hover:text-amber-900 hover:bg-amber-50 px-1.5 py-0.5 rounded transition-colors"
                      title="Refine this clause with AI"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      AI Refine
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSectionId(isEditing ? null : section.id)}
                      className="text-[11px] font-sans text-stone-600 hover:text-stone-900 px-1.5 py-0.5 rounded transition-colors"
                      title="Edit text inline"
                    >
                      {isEditing ? <Check className="w-3 h-3 text-emerald-600" /> : <Edit2 className="w-3 h-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddSubclause(section.id)}
                      className="text-[11px] font-sans text-stone-600 hover:text-stone-900 px-1.5 py-0.5 rounded transition-colors"
                      title="Add subclause paragraph"
                    >
                      + Sub
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(section.id)}
                      className="text-[11px] font-sans text-rose-500 hover:text-rose-700 px-1.5 py-0.5 rounded transition-colors"
                      title="Delete section"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Section Title */}
                  <div className="mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                        className="w-full text-sm font-bold text-stone-900 border border-stone-300 rounded px-2 py-1 font-sans uppercase"
                      />
                    ) : (
                      <h3
                        onClick={() => setEditingSectionId(section.id)}
                        className="text-sm font-bold text-stone-900 tracking-wide cursor-pointer hover:text-amber-800 transition-colors uppercase"
                      >
                        SECTION {section.sectionNumber}. {section.title}
                      </h3>
                    )}
                  </div>

                  {/* Section Content */}
                  <div>
                    {isEditing ? (
                      <textarea
                        value={section.content}
                        onChange={(e) => handleUpdateSectionContent(section.id, e.target.value)}
                        rows={5}
                        className="w-full text-xs md:text-sm text-stone-800 border border-stone-300 rounded p-2.5 leading-relaxed font-serif bg-white shadow-inner focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    ) : (
                      <p
                        onClick={() => setEditingSectionId(section.id)}
                        className="text-xs md:text-sm text-stone-800 leading-relaxed cursor-pointer"
                      >
                        {section.content}
                      </p>
                    )}
                  </div>

                  {/* Subclauses */}
                  {section.subclauses && section.subclauses.length > 0 && (
                    <div className="mt-3 pl-4 border-l border-stone-300 space-y-2">
                      {section.subclauses.map((sub, subIdx) => (
                        <p key={subIdx} className="text-xs text-stone-700 leading-relaxed">
                          {sub}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Section Button at End */}
          <div className="my-8 text-center print:hidden">
            <button
              onClick={handleAddSection}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors font-sans"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Custom Clause Section
            </button>
          </div>

          {/* Execution & Signature Blocks */}
          <div className="mt-12 pt-8 border-t-2 border-stone-300 break-inside-avoid">
            <h4 className="text-center font-bold uppercase tracking-wider text-xs font-sans text-stone-700 mb-6">
              Execution and Signatures
            </h4>
            <p className="text-xs text-stone-600 italic text-center mb-8">
              IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs font-sans">
              {/* Party A Signature Box */}
              <div className="p-4 rounded-lg border border-stone-300 bg-stone-50/50 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-stone-900 uppercase">
                    {document.signatures.partyA.role}
                  </div>
                  <div className="text-stone-600 text-[11px] mb-4">
                    {document.partiesSummary.partyA.name}
                  </div>
                </div>

                {/* Signature Display or Sign Button */}
                <div className="min-h-[80px] border-b border-stone-400 flex flex-col justify-end pb-2 mb-3">
                  {document.signatures.partyA.signature ? (
                    document.signatures.partyA.signature.startsWith('data:image') ? (
                      <img
                        src={document.signatures.partyA.signature}
                        alt="Signature A"
                        className="max-h-14 object-contain"
                      />
                    ) : (
                      <div className="font-serif italic text-xl text-stone-900 tracking-wide">
                        {document.signatures.partyA.signature.replace(/^TYPED:[^:]+:/, '')}
                      </div>
                    )
                  ) : (
                    <div className="text-stone-400 italic text-xs mb-2">
                      Awaiting authorized signature
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-[11px] text-stone-600">
                  <div>
                    <span className="font-semibold text-stone-700">By: </span>
                    {document.signatures.partyA.name}
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Title: </span>
                    {document.signatures.partyA.title || 'Authorized Signatory'}
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Date: </span>
                    {document.signatures.partyA.signatureDate || document.effectiveDate}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-stone-200 print:hidden flex justify-end">
                  <button
                    onClick={() => onOpenSignatureModal('partyA')}
                    className="px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 rounded transition-colors"
                  >
                    {document.signatures.partyA.signature ? 'Change Signature' : 'Sign Party A'}
                  </button>
                </div>
              </div>

              {/* Party B Signature Box */}
              <div className="p-4 rounded-lg border border-stone-300 bg-stone-50/50 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-stone-900 uppercase">
                    {document.signatures.partyB.role}
                  </div>
                  <div className="text-stone-600 text-[11px] mb-4">
                    {document.partiesSummary.partyB.name}
                  </div>
                </div>

                {/* Signature Display or Sign Button */}
                <div className="min-h-[80px] border-b border-stone-400 flex flex-col justify-end pb-2 mb-3">
                  {document.signatures.partyB.signature ? (
                    document.signatures.partyB.signature.startsWith('data:image') ? (
                      <img
                        src={document.signatures.partyB.signature}
                        alt="Signature B"
                        className="max-h-14 object-contain"
                      />
                    ) : (
                      <div className="font-serif italic text-xl text-stone-900 tracking-wide">
                        {document.signatures.partyB.signature.replace(/^TYPED:[^:]+:/, '')}
                      </div>
                    )
                  ) : (
                    <div className="text-stone-400 italic text-xs mb-2">
                      Awaiting counterparty signature
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-[11px] text-stone-600">
                  <div>
                    <span className="font-semibold text-stone-700">By: </span>
                    {document.signatures.partyB.name}
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Title: </span>
                    {document.signatures.partyB.title || 'Authorized Signatory'}
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700">Date: </span>
                    {document.signatures.partyB.signatureDate || 'Pending Execution'}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-stone-200 print:hidden flex justify-end">
                  <button
                    onClick={() => onOpenSignatureModal('partyB')}
                    className="px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 rounded transition-colors"
                  >
                    {document.signatures.partyB.signature ? 'Change Signature' : 'Sign Party B'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer Footer */}
          <div className="mt-12 pt-6 border-t border-stone-300 text-[10px] text-stone-500 font-sans text-center leading-relaxed">
            <p>
              <strong>LEGAL NOTICE:</strong> {document.legalDisclaimer}
            </p>
            <p className="mt-1 font-mono text-[9px] text-stone-400">
              Generated via LegalEase AI Studio · Reference ID {document.documentId} · Authenticated
              Document Structure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
