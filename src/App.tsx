import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DocumentParchment } from './components/DocumentParchment';
import { DocumentGeneratorForm } from './components/DocumentGeneratorForm';
import { ComplianceInspector } from './components/ComplianceInspector';
import { ScenariosView } from './components/ScenariosView';
import { BrandingModal } from './components/BrandingModal';
import { ExportModal } from './components/ExportModal';
import { ClauseAssistantModal } from './components/ClauseAssistantModal';
import { SignatureModal } from './components/SignatureModal';
import { SavedDraftsModal } from './components/SavedDraftsModal';
import { LegalDocument, BrandingConfig, SectionClause, ScenarioPreset } from './types';
import { SCENARIO_PRESETS, DEFAULT_LEGAL_SEAL } from './data/presetScenarios';

const STORAGE_KEY_CURRENT = 'legalease_current_doc';
const STORAGE_KEY_BRANDING = 'legalease_branding_config';
const STORAGE_KEY_DRAFTS = 'legalease_saved_drafts';

export default function App() {
  // Initialize with Scenario 1 (Startup Executive Employment Contract)
  const defaultScenario = SCENARIO_PRESETS[0];

  const [document, setDocument] = useState<LegalDocument>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load current doc from storage', e);
    }
    return defaultScenario.defaultData as LegalDocument;
  });

  const [branding, setBranding] = useState<BrandingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BRANDING);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load branding from storage', e);
    }
    return {
      companyName: 'Aether Dynamics, Inc.',
      companySubtitle: 'Applied Artificial Intelligence & Autonomous Systems',
      companyAddress: '548 Market Street, Suite 39200, San Francisco, CA 94104',
      logoUrl: DEFAULT_LEGAL_SEAL,
      fontFamily: 'serif',
      accentColor: '#1e3a8a',
      showSeal: true,
      watermark: 'none',
      includeHeaderFooter: true,
    };
  });

  const [savedDrafts, setSavedDrafts] = useState<LegalDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DRAFTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load drafts from storage', e);
    }
    return SCENARIO_PRESETS.map((s) => s.defaultData as LegalDocument);
  });

  // Active view tab: 'editor' | 'generator' | 'compliance' | 'scenarios'
  const [activeTab, setActiveTab] = useState<'editor' | 'generator' | 'compliance' | 'scenarios'>('editor');

  // Modals state
  const [isBrandingOpen, setIsBrandingOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSavedDraftsOpen, setIsSavedDraftsOpen] = useState(false);
  const [selectedClauseForAssistant, setSelectedClauseForAssistant] = useState<SectionClause | null>(null);
  const [signatureParty, setSignatureParty] = useState<'partyA' | 'partyB' | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(document));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }, [document]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BRANDING, JSON.stringify(branding));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }, [branding]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(savedDrafts));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }, [savedDrafts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Scenario selection
  const handleSelectScenario = (preset: ScenarioPreset) => {
    const newDoc = preset.defaultData as LegalDocument;
    setDocument(newDoc);
    if (preset.defaultBranding) {
      setBranding((prev) => ({
        ...prev,
        ...preset.defaultBranding,
      }));
    }
    setActiveTab('editor');
    showToast(`Loaded ${preset.title}`);
  };

  // AI Document Generated
  const handleDocumentGenerated = (newDoc: LegalDocument) => {
    setDocument(newDoc);
    setActiveTab('editor');
    showToast(`Successfully generated ${newDoc.title}`);
  };

  // Clause Assistant apply
  const handleApplyRefinedClause = (updatedClause: SectionClause) => {
    const updatedSections = document.sections.map((sec) =>
      sec.id === updatedClause.id ? updatedClause : sec
    );
    setDocument({
      ...document,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    });
    showToast(`Updated Section ${updatedClause.sectionNumber}`);
  };

  // Signature save
  const handleSaveSignature = (
    partyKey: 'partyA' | 'partyB',
    signatureData: string,
    date: string
  ) => {
    const updated = {
      ...document,
      signatures: {
        ...document.signatures,
        [partyKey]: {
          ...document.signatures[partyKey],
          signature: signatureData,
          signatureDate: date,
        },
      },
      updatedAt: new Date().toISOString(),
    };
    setDocument(updated);
    showToast(`Signature recorded for ${document.signatures[partyKey].name}`);
  };

  // Save current document as draft
  const handleSaveCurrentAsDraft = () => {
    const existingIndex = savedDrafts.findIndex((d) => d.id === document.id);
    let updatedDrafts: LegalDocument[];
    if (existingIndex >= 0) {
      updatedDrafts = [...savedDrafts];
      updatedDrafts[existingIndex] = { ...document, updatedAt: new Date().toISOString() };
    } else {
      updatedDrafts = [{ ...document, updatedAt: new Date().toISOString() }, ...savedDrafts];
    }
    setSavedDrafts(updatedDrafts);
    showToast('Document saved to drafts archive');
  };

  const handleDeleteDraft = (id: string) => {
    setSavedDrafts(savedDrafts.filter((d) => d.id !== id));
    showToast('Draft removed');
  };

  const handleDuplicateDraft = (doc: LegalDocument) => {
    const duplicated: LegalDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      documentId: `${doc.documentId}-COPY`,
      title: `${doc.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSavedDrafts([duplicated, ...savedDrafts]);
    showToast('Duplicated draft created');
  };

  const handleNewDocument = () => {
    setActiveTab('generator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBranding={() => setIsBrandingOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSavedDrafts={() => setIsSavedDraftsOpen(true)}
        onNewDocument={handleNewDocument}
        documentTitle={document.title}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'scenarios' && (
          <ScenariosView
            onSelectScenario={handleSelectScenario}
            onOpenGenerator={() => setActiveTab('generator')}
          />
        )}

        {activeTab === 'generator' && (
          <DocumentGeneratorForm
            onDocumentGenerated={handleDocumentGenerated}
            onSelectScenario={handleSelectScenario}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        )}

        {activeTab === 'editor' && (
          <DocumentParchment
            document={document}
            branding={branding}
            onUpdateDocument={setDocument}
            onOpenClauseAssistant={(clause) => setSelectedClauseForAssistant(clause)}
            onOpenSignatureModal={(party) => setSignatureParty(party)}
          />
        )}

        {activeTab === 'compliance' && (
          <ComplianceInspector
            document={document}
            onUpdateDocument={setDocument}
            onSwitchToEditor={() => setActiveTab('editor')}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <BrandingModal
        isOpen={isBrandingOpen}
        onClose={() => setIsBrandingOpen(false)}
        branding={branding}
        setBranding={setBranding}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        document={document}
        branding={branding}
      />

      <SavedDraftsModal
        isOpen={isSavedDraftsOpen}
        onClose={() => setIsSavedDraftsOpen(false)}
        currentDocument={document}
        onLoadDraft={(doc) => {
          setDocument(doc);
          setActiveTab('editor');
          showToast(`Opened ${doc.title}`);
        }}
        savedDrafts={savedDrafts}
        onSaveCurrentAsDraft={handleSaveCurrentAsDraft}
        onDeleteDraft={handleDeleteDraft}
        onDuplicateDraft={handleDuplicateDraft}
      />

      <ClauseAssistantModal
        isOpen={!!selectedClauseForAssistant}
        onClose={() => setSelectedClauseForAssistant(null)}
        clause={selectedClauseForAssistant}
        documentType={document.documentType}
        onApplyClause={handleApplyRefinedClause}
      />

      <SignatureModal
        isOpen={!!signatureParty}
        onClose={() => setSignatureParty(null)}
        party={signatureParty ? document.signatures[signatureParty] : null}
        partyKey={signatureParty || 'partyA'}
        onSaveSignature={handleSaveSignature}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/40 text-amber-200 px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
