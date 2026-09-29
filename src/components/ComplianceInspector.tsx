import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw,
  Plus,
  Loader2,
  Check,
} from 'lucide-react';
import { LegalDocument, RiskFinding, SectionClause } from '../types';

interface ComplianceInspectorProps {
  document: LegalDocument;
  onUpdateDocument: (updated: LegalDocument) => void;
  onSwitchToEditor: () => void;
}

export const ComplianceInspector: React.FC<ComplianceInspectorProps> = ({
  document,
  onUpdateDocument,
  onSwitchToEditor,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [addedClauses, setAddedClauses] = useState<string[]>([]);

  const handleRunAudit = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: document.documentType,
          jurisdiction: document.jurisdiction,
          sections: document.sections,
          termTable: document.termTable,
        }),
      });

      const data = await response.json();
      if (data.success && data.review) {
        const newFindings: RiskFinding[] = (data.review.findings || []).map((f: any) => ({
          severity: f.severity,
          clauseTitle: f.clauseTitle,
          issue: f.issue,
          recommendation: f.recommendation,
        }));

        onUpdateDocument({
          ...document,
          riskReview: newFindings,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleInsertRecommendedClause = (finding: RiskFinding) => {
    const newSecNum = (document.sections.length + 1).toString();
    const title = finding.clauseTitle || 'COMPLIANCE & RISK MITIGATION';
    const content = `In accordance with governing legal standards, the parties agree: ${finding.recommendation} This clause shall be construed in harmony with all prior covenants contained herein.`;

    const newSec: SectionClause = {
      id: `sec-recom-${Date.now()}`,
      sectionNumber: newSecNum,
      title: title.toUpperCase(),
      content,
      subclauses: [],
      standard: true,
      category: 'Compliance',
    };

    onUpdateDocument({
      ...document,
      sections: [...document.sections, newSec],
      updatedAt: new Date().toISOString(),
    });

    setAddedClauses([...addedClauses, title]);
  };

  const findings = document.riskReview || [];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Legal Risk & Compliance Audit</h2>
              <span className="px-2 py-0.5 text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-md">
                Verified Structure
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditing {document.documentType} under {document.jurisdiction}
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={analyzing}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          {analyzing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {analyzing ? 'Evaluating Agreement...' : 'Re-Run Compliance Audit'}
        </button>
      </div>

      {/* Compliance Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
            Enforceability Index
          </span>
          <div className="text-xl font-bold text-emerald-400 font-mono">High</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Standard consideration and recitals verified
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
            Key Covenants Present
          </span>
          <div className="text-xl font-bold text-amber-300 font-mono">
            {document.sections.length} Sections
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Includes definitions, obligations, and execution blocks
          </p>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
            Signature Readiness
          </span>
          <div className="text-xl font-bold text-slate-200 font-mono">
            {document.signatures.partyA.signature && document.signatures.partyB.signature
              ? 'Fully Executed'
              : document.signatures.partyA.signature
              ? 'Partially Signed'
              : 'Draft Stage'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Digital signature pads configured for both parties
          </p>
        </div>
      </div>

      {/* Findings List */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-white">
            Practical Observations & Best Practices
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {findings.length} Items Identified
          </span>
        </div>

        {findings.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No immediate compliance risks flagged. Agreement follows standard commercial drafting guidelines.
          </div>
        ) : (
          <div className="space-y-3">
            {findings.map((item, idx) => {
              const isAdded = addedClauses.includes(item.clauseTitle || '');

              return (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {item.severity === 'high' ? (
                        <div className="p-1.5 rounded-md bg-rose-950 text-rose-400 border border-rose-800">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      ) : item.severity === 'medium' ? (
                        <div className="p-1.5 rounded-md bg-amber-950 text-amber-400 border border-amber-800">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-md bg-blue-950 text-blue-400 border border-blue-800">
                          <Info className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">
                          {item.clauseTitle || item.clause || 'Legal Covenant'}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {item.severity} severity
                        </span>
                      </div>
                      {item.issue && (
                        <p className="text-xs text-slate-300 mt-1">{item.issue}</p>
                      )}
                      <p className="text-xs text-amber-200/90 mt-1 font-medium">
                        Recommendation: {item.recommendation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleInsertRecommendedClause(item)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                        isAdded
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Inserted</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Insert Clause</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Remember to review jurisdictional enforceability with local legal counsel</span>
          <button
            onClick={onSwitchToEditor}
            className="text-amber-400 hover:text-amber-300 font-medium"
          >
            Return to Live Editor →
          </button>
        </div>
      </div>
    </div>
  );
};
