import { LegalDocument, BrandingConfig } from '../types';

export function generatePlainText(doc: LegalDocument, branding: BrandingConfig): string {
  const lines: string[] = [];

  if (branding.includeHeaderFooter && branding.companyName) {
    lines.push(branding.companyName.toUpperCase());
    if (branding.companySubtitle) lines.push(branding.companySubtitle);
    if (branding.companyAddress) lines.push(branding.companyAddress);
    lines.push('================================================================================');
    lines.push('');
  }

  lines.push(doc.title.toUpperCase());
  lines.push(`Document Reference: ${doc.documentId}`);
  lines.push(`Effective Date: ${doc.effectiveDate}`);
  lines.push(`Governing Jurisdiction: ${doc.jurisdiction}`);
  lines.push('--------------------------------------------------------------------------------');
  lines.push('');

  lines.push('--- KEY TERMS SUMMARY TABLE ---');
  if (doc.termTable && doc.termTable.length > 0) {
    for (const term of doc.termTable) {
      lines.push(`* ${term.label.padEnd(30, ' ')} : ${term.value}`);
    }
  }
  lines.push('');

  lines.push('--- PARTIES ---');
  lines.push(`1. ${doc.partiesSummary.partyA.role}: ${doc.partiesSummary.partyA.name}`);
  if (doc.partiesSummary.partyA.details) lines.push(`   ${doc.partiesSummary.partyA.details}`);
  lines.push(`2. ${doc.partiesSummary.partyB.role}: ${doc.partiesSummary.partyB.name}`);
  if (doc.partiesSummary.partyB.details) lines.push(`   ${doc.partiesSummary.partyB.details}`);
  lines.push('');

  if (doc.recitals && doc.recitals.length > 0) {
    lines.push('--- RECITALS ---');
    for (const recital of doc.recitals) {
      lines.push(recital);
      lines.push('');
    }
  }

  lines.push('--- TERMS AND CONDITIONS ---');
  for (const sec of doc.sections) {
    lines.push(`SECTION ${sec.sectionNumber}. ${sec.title.toUpperCase()}`);
    lines.push(sec.content);
    lines.push('');
    if (sec.subclauses && sec.subclauses.length > 0) {
      for (const sub of sec.subclauses) {
        lines.push(`    ${sub}`);
      }
      lines.push('');
    }
  }

  lines.push('--- SIGNATURES ---');
  lines.push('IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.');
  lines.push('');
  lines.push(`${doc.signatures.partyA.role.toUpperCase()}:`);
  lines.push(`Signature: __________________________`);
  lines.push(`Name:      ${doc.signatures.partyA.name}`);
  lines.push(`Title:     ${doc.signatures.partyA.title || 'Authorized Signatory'}`);
  lines.push(`Date:      ${doc.signatures.partyA.signatureDate || doc.effectiveDate}`);
  lines.push('');
  lines.push(`${doc.signatures.partyB.role.toUpperCase()}:`);
  lines.push(`Signature: __________________________`);
  lines.push(`Name:      ${doc.signatures.partyB.name}`);
  lines.push(`Title:     ${doc.signatures.partyB.title || 'Authorized Signatory'}`);
  lines.push(`Date:      ${doc.signatures.partyB.signatureDate || doc.effectiveDate}`);
  lines.push('');
  lines.push('================================================================================');
  lines.push(`DISCLAIMER: ${doc.legalDisclaimer}`);

  return lines.join('\n');
}

export function downloadPlainText(doc: LegalDocument, branding: BrandingConfig): void {
  const text = generatePlainText(doc, branding);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const sanitizedName = (doc.title || 'Legal_Agreement')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_');
  a.download = `${sanitizedName}_${doc.documentId}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
