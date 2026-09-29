import React from 'react';
import {
  FileText,
  Shield,
  Home,
  Briefcase,
  ArrowRight,
  Sparkles,
  Download,
  Building,
  CheckCircle,
} from 'lucide-react';
import { ScenarioPreset } from '../types';
import { SCENARIO_PRESETS } from '../data/presetScenarios';

interface ScenariosViewProps {
  onSelectScenario: (scenario: ScenarioPreset) => void;
  onOpenGenerator: () => void;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({
  onSelectScenario,
  onOpenGenerator,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      {/* Hero Showcase Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Legal Document Studio
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
            Professional legal agreements with AI drafting, custom branding, and instant export.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            LegalEase empowers founders, freelancers, and property managers to generate accurate, customizable, and enforceable legal documents in seconds. Includes automated key term tables, digital execution blocks, and export to <strong className="text-amber-300">.PDF</strong>, <strong className="text-amber-300">.DOCX</strong>, and <strong className="text-amber-300">.TXT</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenGenerator}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-lg shadow-amber-950/40 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Open AI Generator
            </button>
            <button
              onClick={() => onSelectScenario(SCENARIO_PRESETS[0])}
              className="px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>Explore Scenario 1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Scenarios Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Pre-Configured Scenarios
            </h2>
            <p className="text-xs text-slate-400">
              Select a real-world scenario to launch the live legal editor with realistic terms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SCENARIO_PRESETS.map((scenario) => {
            const getIcon = () => {
              if (scenario.scenarioNumber === 1) return <Briefcase className="w-6 h-6 text-amber-400" />;
              if (scenario.scenarioNumber === 2) return <Shield className="w-6 h-6 text-teal-400" />;
              return <Home className="w-6 h-6 text-amber-500" />;
            };

            const getHighlight = () => {
              if (scenario.scenarioNumber === 1)
                return 'Clauses for roles, responsibilities, compensation, equity options, and branded PDF export.';
              if (scenario.scenarioNumber === 2)
                return 'Bilateral scope of confidentiality, trade secrets exclusion, and California governing law.';
              return 'Property address, rent, deposit escrow, pet policy, quiet hours, and .DOCX export.';
            };

            return (
              <div
                key={scenario.id}
                className="rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 flex flex-col justify-between transition-all group shadow-xl hover:shadow-2xl hover:shadow-amber-950/20"
              >
                <div>
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {getIcon()}
                    </div>
                    <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-900/60">
                      {scenario.badge}
                    </span>
                  </div>

                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                    {scenario.documentType}
                  </span>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {scenario.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {scenario.subtitle}
                  </p>

                  <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
                    <span className="text-amber-400 font-semibold block mb-0.5">Key Capability:</span>
                    {getHighlight()}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {scenario.scenarioNumber === 1 ? 'Branded PDF' : scenario.scenarioNumber === 2 ? 'PDF / TXT' : 'Word .DOCX'}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectScenario(scenario)}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Load Scenario</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Pillar Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-amber-400 mb-2 font-mono text-xs uppercase font-semibold">
            01. Automated Term Tables
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Instant Key Term Summary</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extracts critical parties, effective dates, consideration, and covenants into an executive summary table at the top of every agreement.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-amber-400 mb-2 font-mono text-xs uppercase font-semibold">
            02. AI Clause Customizer
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Tailor & Balance Provisions</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rewrite any clause to be mutual, insert 30-day cure periods, strengthen IP assignment, or translate dense legalese into plain English.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-amber-400 mb-2 font-mono text-xs uppercase font-semibold">
            03. Multi-Format Export
          </div>
          <h4 className="text-sm font-bold text-white mb-1">.PDF, .DOCX, and .TXT</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download print-ready PDFs with company logos, clean Microsoft Word .docx documents with table formatting, or plain text transcripts.
          </p>
        </div>
      </div>
    </div>
  );
};
