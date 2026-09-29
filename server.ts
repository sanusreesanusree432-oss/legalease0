import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side initialization of GoogleGenAI SDK with required user-agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Generate full legal document
app.post('/api/generate-legal-document', async (req, res) => {
  try {
    const {
      documentType = 'Employment Contract',
      partyA = {},
      partyB = {},
      effectiveDate = new Date().toISOString().split('T')[0],
      jurisdiction = 'State of Delaware, United States',
      duration = 'Indefinite / At-will',
      financialTerms = '',
      corePurpose = '',
      customClauses = [],
      selectedTone = 'standard', // 'standard' | 'plain-english' | 'protective'
    } = req.body;

    const prompt = `You are an elite legal contract architect. Draft a comprehensive, professional, enforceable, and legally structured document of type "${documentType}".

Parameters:
- Document Type: ${documentType}
- Party A (${partyA.role || 'First Party'}): ${partyA.name || 'Party A'} (${partyA.details || 'Entity/Individual'})
- Party B (${partyB.role || 'Second Party'}): ${partyB.name || 'Party B'} (${partyB.details || 'Entity/Individual'})
- Effective Date: ${effectiveDate}
- Jurisdiction / Governing Law: ${jurisdiction}
- Duration / Term: ${duration}
- Financial Terms & Consideration: ${financialTerms || 'Standard consideration as defined herein'}
- Primary Purpose / Scope: ${corePurpose || 'Standard commercial and operational arrangement'}
- Additional Clauses / Preferences: ${customClauses.join(', ') || 'Standard covenants'}
- Drafting Tone: ${selectedTone}

Draft a realistic, complete document adhering to standard legal formatting (Title, Recitals/Preamble, Numbered Sections with clear sub-paragraphs, Definitions, Covenants, Representations & Warranties, Term & Termination, Confidentiality, Governing Law, Severability, Entire Agreement, and Execution Signature Blocks).

You MUST respond strictly with a valid JSON object matching this exact schema:
{
  "title": "string, e.g. EMPLOYMENT AGREEMENT or MUTUAL NON-DISCLOSURE AGREEMENT",
  "documentType": "${documentType}",
  "documentId": "string, e.g. LEG-2026-XXXX",
  "partiesSummary": {
    "partyA": { "role": "${partyA.role || 'Party A'}", "name": "${partyA.name || 'Party A'}", "details": "string" },
    "partyB": { "role": "${partyB.role || 'Party B'}", "name": "${partyB.name || 'Party B'}", "details": "string" }
  },
  "termTable": [
    { "label": "Document Type", "value": "string", "category": "General" },
    { "label": "Effective Date", "value": "string", "category": "Timeline" },
    { "label": "Governing Law & Jurisdiction", "value": "string", "category": "Legal" },
    { "label": "Primary Consideration / Compensation", "value": "string", "category": "Financial" },
    { "label": "Term & Duration", "value": "string", "category": "Timeline" },
    { "label": "Termination Notice", "value": "string", "category": "Legal" },
    { "label": "Confidentiality Term", "value": "string", "category": "Covenant" },
    { "label": "Dispute Resolution", "value": "string", "category": "Legal" }
  ],
  "recitals": [
    "WHEREAS statement 1...",
    "WHEREAS statement 2...",
    "NOW, THEREFORE, in consideration of the mutual covenants herein contained..."
  ],
  "sections": [
    {
      "id": "sec-1",
      "sectionNumber": "1",
      "title": "DEFINITIONS AND APPOINTMENT",
      "content": "Full section text with clear legal phrasing and complete paragraphs.",
      "subclauses": ["1.1 Scope...", "1.2 Performance..."],
      "category": "Core",
      "standard": true
    }
  ],
  "signatures": {
    "partyA": { "role": "string", "name": "string", "title": "string" },
    "partyB": { "role": "string", "name": "string", "title": "string" }
  },
  "riskReview": [
    {
      "severity": "low" | "medium" | "high" | "info",
      "clause": "Title or topic",
      "recommendation": "Concise guidance on risk mitigation or best practice."
    }
  ],
  "legalDisclaimer": "This document is generated for informational and productivity purposes and does not constitute formal legal counsel. Always consult qualified legal representation in your jurisdiction prior to execution."
}

Ensure:
1. Provide at least 7 to 10 rich, fully articulated sections covering all necessary aspects of this agreement (do not cut short or use placeholders).
2. The termTable provides an immediate, scannable overview of all key business and operational terms.
3. The riskReview flags 3-4 actionable legal review notes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let documentData;
    try {
      documentData = JSON.parse(responseText);
    } catch {
      // If parsing fails, attempt regex extraction
      const match = responseText.match(/\{[\s\S]*\}/);
      if (match) {
        documentData = JSON.parse(match[0]);
      } else {
        throw new Error('Failed to parse document JSON from AI response.');
      }
    }

    res.json({ success: true, document: documentData });
  } catch (error: any) {
    console.error('Error generating legal document:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while generating the document.',
    });
  }
});

// Endpoint: AI Clause Assistant / Refiner
app.post('/api/refine-clause', async (req, res) => {
  try {
    const { sectionTitle, sectionContent, instruction, documentType } = req.body;

    const prompt = `You are an expert legal draftsman. You are revising a specific clause in a "${documentType || 'Legal Agreement'}".
Current Section Title: ${sectionTitle}
Current Section Content:
"""
${sectionContent}
"""

User Revision Instruction:
"${instruction}"

Provide the revised section with enhanced legal enforceability and accuracy according to the instruction.
Respond strictly with a JSON object:
{
  "revisedTitle": "string",
  "revisedContent": "string",
  "explanation": "Brief explanation of legal adjustments made",
  "riskNote": "Brief legal risk assessment"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    const result = JSON.parse(responseText);
    res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error refining clause:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while refining the clause.',
    });
  }
});

// Endpoint: Compliance & Risk Review
app.post('/api/analyze-compliance', async (req, res) => {
  try {
    const { documentType, jurisdiction, sections, termTable } = req.body;

    const prompt = `Review the following legal agreement for potential risks, ambiguities, unbalanced obligations, and compliance considerations under ${jurisdiction || 'general commercial law'}.
Document Type: ${documentType}
Key Terms: ${JSON.stringify(termTable || [])}
Sections Summary:
${(sections || []).map((s: any) => `${s.sectionNumber}. ${s.title}: ${s.content.slice(0, 200)}...`).join('\n')}

Identify 4 to 6 specific, practical observations categorized into high, medium, low, or informational severity.
Respond strictly in JSON format:
{
  "overallHealthScore": "High" | "Moderate" | "Needs Review",
  "summary": "1-2 sentence overview of document enforceability and balance",
  "findings": [
    {
      "severity": "high" | "medium" | "low" | "info",
      "clauseTitle": "Relevant section",
      "issue": "What might be ambiguous, missing, or risky",
      "recommendation": "Concrete suggestion to remedy"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json({ success: true, review: result });
  } catch (error: any) {
    console.error('Error analyzing compliance:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while analyzing compliance.',
    });
  }
});

// Setup Vite middlewares in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LegalEase server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
