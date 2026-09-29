export type DocumentType =
  | 'Employment Contract'
  | 'Non-Disclosure Agreement'
  | 'Residential Lease Agreement'
  | 'Commercial Lease Agreement'
  | 'Independent Contractor Agreement'
  | 'Consulting Agreement'
  | 'Intellectual Property Assignment'
  | 'Promissory Note'
  | 'Website Terms of Service';

export interface TermTableItem {
  label: string;
  value: string;
  category: string;
}

export interface SectionClause {
  id: string;
  sectionNumber: string;
  title: string;
  content: string;
  subclauses?: string[];
  standard?: boolean;
  category?: string;
}

export interface PartyInfo {
  role: string;
  name: string;
  title?: string;
  details?: string;
  signature?: string;
  signatureDate?: string;
}

export interface RiskFinding {
  severity: 'high' | 'medium' | 'low' | 'info';
  clauseTitle?: string;
  clause?: string;
  issue?: string;
  recommendation: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  documentType: DocumentType;
  documentId: string;
  jurisdiction: string;
  effectiveDate: string;
  partiesSummary: {
    partyA: PartyInfo;
    partyB: PartyInfo;
  };
  termTable: TermTableItem[];
  recitals: string[];
  sections: SectionClause[];
  signatures: {
    partyA: PartyInfo;
    partyB: PartyInfo;
  };
  riskReview?: RiskFinding[];
  legalDisclaimer: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandingConfig {
  companyName: string;
  companySubtitle: string;
  companyAddress: string;
  logoUrl: string | null;
  fontFamily: 'serif' | 'sans' | 'classic';
  accentColor: string;
  showSeal: boolean;
  watermark: 'none' | 'DRAFT' | 'CONFIDENTIAL' | 'EXECUTED';
  includeHeaderFooter: boolean;
}

export interface ScenarioPreset {
  id: string;
  scenarioNumber: 1 | 2 | 3 | 4 | 5;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  documentType: DocumentType;
  defaultData: Partial<LegalDocument>;
  defaultBranding?: Partial<BrandingConfig>;
}
