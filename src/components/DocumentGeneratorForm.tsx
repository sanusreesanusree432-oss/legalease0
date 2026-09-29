import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  Building,
  User,
  Calendar,
  DollarSign,
  Layers,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { DocumentType, LegalDocument, ScenarioPreset } from '../types';
import { SCENARIO_PRESETS } from '../data/presetScenarios';

interface DocumentGeneratorFormProps {
  onDocumentGenerated: (doc: LegalDocument) => void;
  onSelectScenario: (scenario: ScenarioPreset) => void;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DocumentGeneratorForm: React.FC<DocumentGeneratorFormProps> = ({
  onDocumentGenerated,
  onSelectScenario,
  isGenerating,
  setIsGenerating,
}) => {
  const [docType, setDocType] = useState<DocumentType>('Employment Contract');
  const [partyAName, setPartyAName] = useState('Acme Robotics Corp.');
  const [partyARole, setPartyARole] = useState('Employer / Company');
  const [partyADetails, setPartyADetails] = useState('Delaware corporation, 100 Tech Blvd, San Francisco, CA');

  const [partyBName, setPartyBName] = useState('Dr. Alex Mercer');
  const [partyBRole, setPartyBRole] = useState('Employee / Senior Engineer');
  const [partyBDetails, setPartyBDetails] = useState('Individual residing at 450 Fremont St, San Francisco, CA');

  const [effectiveDate, setEffectiveDate] = useState('2026-10-01');
  const [jurisdiction, setJurisdiction] = useState('State of Delaware, United States');
  const [duration, setDuration] = useState('Full-time, At-will employment');
  const [financialTerms, setFinancialTerms] = useState('$165,000 USD base salary per annum + 0.5% Common Stock options');
  const [corePurpose, setCorePurpose] = useState('Senior Full-Stack AI Engineer responsible for foundational algorithms');

  const [customClauses, setCustomClauses] = useState<string[]>([
    'Comprehensive IP Assignment',
    'Confidentiality & Trade Secrets',
    '30-Day Mutual Termination Notice',
    'Binding JAMS Arbitration',
  ]);

  const [selectedTone, setSelectedTone] = useState<'standard' | 'plain-english' | 'protective'>('standard');
  const [error, setError] = useState<string | null>(null);

  const documentTypes: { type: DocumentType; label: string; desc: string }[] = [
    { type: 'Employment Contract', label: 'Employment Contract', desc: 'Startup or corporate executive and employee agreements' },
    { type: 'Non-Disclosure Agreement', label: 'Non-Disclosure (NDA)', desc: 'Mutual or unilateral proprietary info protection' },
    { type: 'Residential Lease Agreement', label: 'Residential Lease', desc: 'Tenancy, rent, security deposit, and property rules' },
    { type: 'Commercial Lease Agreement', label: 'Commercial Lease', desc: 'Premises lease, CAM charges, and permitted use' },
    { type: 'Independent Contractor Agreement', label: 'Independent Contractor', desc: 'Freelance, milestone deliverables, and IP ownership' },
    { type: 'Consulting Agreement', label: 'Consulting Agreement', desc: 'Professional advisory services, retainer, and liability' },
    { type: 'Intellectual Property Assignment', label: 'IP Assignment', desc: 'Transfer of copyrights, patents, and technical code' },
    { type: 'Promissory Note', label: 'Promissory Note / Loan', desc: 'Repayment schedule, principal, interest, and default' },
  ];

  const clauseOptions = [
    'Comprehensive IP Assignment',
    'Confidentiality & Trade Secrets',
    '30-Day Mutual Termination Notice',
    'Binding JAMS Arbitration',
    'Non-Solicitation of Clients & Employees (1 Year)',
    'Non-Compete Covenant',
    'Force Majeure & Emergency Suspension',
    'Severability & Savings Clause',
    'Limitation of Liability Cap',
    'Indemnification & Hold Harmless',
  ];

  const handleDocTypeChange = (newType: DocumentType) => {
    setDocType(newType);
    if (newType === 'Employment Contract') {
      setPartyARole('Employer / Company');
      setPartyAName('Acme Robotics Corp.');
      setPartyBRole('Employee / Specialist');
      setPartyBName('Dr. Alex Mercer');
      setDuration('Full-time, At-will');
      setFinancialTerms('$165,000 USD base salary + stock options');
      setCorePurpose('Engineering and development of core automated technologies');
    } else if (newType === 'Non-Disclosure Agreement') {
      setPartyARole('Disclosing / Receiving Party');
      setPartyAName('Nexus Digital Studio LLC');
      setPartyBRole('Disclosing / Receiving Party');
      setPartyBName('Horizon Health Systems');
      setDuration('Two (2) Years from Effective Date');
      setFinancialTerms('Mutual consideration of confidential disclosures');
      setCorePurpose('Evaluating a prospective commercial product partnership');
    } else if (newType === 'Residential Lease Agreement') {
      setPartyARole('Landlord / Owner');
      setPartyAName('Highland Properties LLC');
      setPartyBRole('Tenant / Resident');
      setPartyBName('Michael & Jessica Green');
      setDuration('12-Month Fixed Lease Term');
      setFinancialTerms('$2,200.00 / month + $2,200.00 security deposit');
      setCorePurpose('Exclusive single-family residential occupancy of premises');
    } else if (newType === 'Independent Contractor Agreement') {
      setPartyARole('Client / Company');
      setPartyAName('Summit Media Inc.');
      setPartyBRole('Contractor / Consultant');
      setPartyBName('Apex Design Works');
      setDuration('Project duration: 6 Months');
      setFinancialTerms('$8,500 USD per month retainer upon milestone approval');
      setCorePurpose('Full UX overhaul and design system architecture');
    }
  };

  const toggleClause = (clause: string) => {
    if (customClauses.includes(clause)) {
      setCustomClauses(customClauses.filter((c) => c !== clause));
    } else {
      setCustomClauses([...customClauses, clause]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-legal-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: docType,
          partyA: {
            role: partyARole,
            name: partyAName,
            details: partyADetails,
          },
          partyB: {
            role: partyBRole,
            name: partyBName,
            details: partyBDetails,
          },
          effectiveDate,
          jurisdiction,
          duration,
          financialTerms,
          corePurpose,
          customClauses,
          selectedTone,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate document');
      }

      const generatedDoc: LegalDocument = {
        ...data.document,
        id: `doc-${Date.now()}`,
        documentId: data.document.documentId || `LE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onDocumentGenerated(generatedDoc);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while contacting AI legal engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Quick Scenario Launch Banners */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              One-Click Scenario Templates
            </span>
            <h3 className="text-sm font-medium text-slate-200 mt-0.5">
              Instant realistic setups matching core use cases
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {SCENARIO_PRESETS.length} Real-World Presets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SCENARIO_PRESETS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className="p-3.5 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/60 transition-all text-left group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-amber-400 font-mono">
                    {scenario.badge}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">
                    {scenario.documentType.split(' ')[0]}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                  {scenario.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {scenario.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-amber-200">
                <span>Load Agreement</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Drafting Form */}
      <div className="p-6 sm:p-8 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            AI Document Drafting Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Specify the parties, terms, duration, and legal provisions. LegalEase generates an authenticated, enforceable draft with automatic term tables.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* 1. Document Type Grid */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Select Document Classification
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {documentTypes.map((dt) => (
              <button
                key={dt.type}
                type="button"
                onClick={() => handleDocTypeChange(dt.type)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  docType === dt.type
                    ? 'border-amber-500 bg-amber-950/20 text-white shadow-xs'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold text-amber-200 truncate">{dt.label}</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{dt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Parties Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Party A */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Building className="w-4 h-4 text-amber-400" />
              First Party (Entity / Discloser / Employer)
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Party Role Label</span>
              <input
                type="text"
                value={partyARole}
                onChange={(e) => setPartyARole(e.target.value)}
                placeholder="e.g. Employer / Company"
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Legal Name</span>
              <input
                type="text"
                value={partyAName}
                onChange={(e) => setPartyAName(e.target.value)}
                placeholder="e.g. Acme Robotics Corp"
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Address & Entity Jurisdiction</span>
              <input
                type="text"
                value={partyADetails}
                onChange={(e) => setPartyADetails(e.target.value)}
                placeholder="e.g. Delaware corporation, 100 Tech Blvd, San Francisco, CA"
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Party B */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <User className="w-4 h-4 text-amber-400" />
              Second Party (Individual / Counterparty / Tenant)
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Party Role Label</span>
              <input
                type="text"
                value={partyBRole}
                onChange={(e) => setPartyBRole(e.target.value)}
                placeholder="e.g. Employee / Engineer"
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Legal Name</span>
              <input
                type="text"
                value={partyBName}
                onChange={(e) => setPartyBName(e.target.value)}
                placeholder="e.g. Dr. Alex Mercer"
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Address & Residence Details</span>
              <input
                type="text"
                value={partyBDetails}
                onChange={(e) => setPartyBDetails(e.target.value)}
                placeholder="e.g. Individual residing at 450 Fremont St, San Francisco, CA"
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Dates, Jurisdiction & Financials */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Effective Execution Date
            </span>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1">Governing Jurisdiction</span>
            <input
              type="text"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              placeholder="e.g. State of Delaware, United States"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1">Term & Duration</span>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 12 Months / At-Will"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* 4. Financial Terms & Consideration */}
        <div>
          <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Financial Consideration / Compensation / Rent / Fee Structure
          </span>
          <input
            type="text"
            value={financialTerms}
            onChange={(e) => setFinancialTerms(e.target.value)}
            placeholder="e.g. $165,000 USD base salary per annum + 0.5% Common Stock options"
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* 5. Purpose & Scope */}
        <div>
          <span className="text-xs text-slate-400 block mb-1">Primary Scope / Duties / Purpose</span>
          <textarea
            value={corePurpose}
            onChange={(e) => setCorePurpose(e.target.value)}
            rows={2}
            placeholder="Describe the primary role responsibilities, deliverables, premises, or collaborative purpose..."
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* 6. Custom Clauses & Protections */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-400" />
            Specific Clauses & Covenants to Include
          </label>
          <div className="flex flex-wrap gap-2">
            {clauseOptions.map((clause) => {
              const active = customClauses.includes(clause);
              return (
                <button
                  key={clause}
                  type="button"
                  onClick={() => toggleClause(clause)}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                    active
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {active ? `✓ ${clause}` : `+ ${clause}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Tone Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Drafting Register & Tone
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'standard', label: 'Standard Legal Rigor', desc: 'Formal, standard court-tested terminology' },
              { id: 'plain-english', label: 'Modern Plain-English', desc: 'Accessible, crisp, and direct legal language' },
              { id: 'protective', label: 'Protective / High-Protection', desc: 'Robust safeguards favoring primary party' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTone(t.id as any)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  selectedTone === t.id
                    ? 'border-amber-500 bg-amber-950/20 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-semibold text-amber-200">{t.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Generates complete agreement with automated term table and sections</span>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !partyAName || !partyBName}
            className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 rounded-lg shadow-md shadow-amber-950/40 transition-all flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Drafting Enforceable Agreement...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Legal Document</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
