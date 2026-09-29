import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} from 'docx';
import { LegalDocument, BrandingConfig } from '../types';

export async function exportToDocx(
  docData: LegalDocument,
  branding: BrandingConfig
): Promise<void> {
  const children: (Paragraph | Table)[] = [];

  // Header / Letterhead
  if (branding.includeHeaderFooter && branding.companyName) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: branding.companyName.toUpperCase(),
            bold: true,
            size: 24, // 12pt
            color: '1A202C',
          }),
        ],
      })
    );

    if (branding.companySubtitle) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: branding.companySubtitle,
              italics: true,
              size: 18,
              color: '4A5568',
            }),
          ],
        })
      );
    }

    if (branding.companyAddress) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: branding.companyAddress,
              size: 16,
              color: '718096',
            }),
          ],
        })
      );
    }
  }

  // Document Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: docData.title,
          bold: true,
          size: 28, // 14pt
          color: '0F172A',
        }),
      ],
    })
  );

  // Metadata Line (Reference & Effective Date)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `Document Reference: ${docData.documentId} | Effective Date: ${docData.effectiveDate} | Jurisdiction: ${docData.jurisdiction}`,
          size: 18,
          color: '475569',
        }),
      ],
    })
  );

  // Key Terms Summary Table Heading
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: 'KEY TERMS SUMMARY TABLE',
          bold: true,
          size: 20,
          color: '1E293B',
        }),
      ],
    })
  );

  // Build the Key Terms Table
  if (docData.termTable && docData.termTable.length > 0) {
    const tableRows: TableRow[] = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Term / Provision', bold: true, size: 18 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Agreed Specification', bold: true, size: 18 })],
              }),
            ],
          }),
        ],
      }),
    ];

    for (const item of docData.termTable) {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: item.label, bold: true, size: 18 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: item.value, size: 18 })],
                }),
              ],
            }),
          ],
        })
      );
    }

    const termTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
        left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
        right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      },
    });

    children.push(termTable);
  }

  // Spacing after table
  children.push(new Paragraph({ spacing: { after: 250 }, children: [] }));

  // Parties Preamble
  children.push(
    new Paragraph({
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: `THIS AGREEMENT is entered into on this ${docData.effectiveDate}, by and between:`,
          bold: true,
          size: 20,
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 120 },
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: `${docData.partiesSummary.partyA.role}: `,
          bold: true,
          size: 20,
        }),
        new TextRun({
          text: `${docData.partiesSummary.partyA.name}, ${docData.partiesSummary.partyA.details || ''}`,
          size: 20,
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 240 },
      bullet: { level: 0 },
      children: [
        new TextRun({
          text: `${docData.partiesSummary.partyB.role}: `,
          bold: true,
          size: 20,
        }),
        new TextRun({
          text: `${docData.partiesSummary.partyB.name}, ${docData.partiesSummary.partyB.details || ''}`,
          size: 20,
        }),
      ],
    })
  );

  // Recitals (WHEREAS)
  if (docData.recitals && docData.recitals.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 120 },
        children: [
          new TextRun({
            text: 'RECITALS',
            bold: true,
            size: 20,
            color: '1E293B',
          }),
        ],
      })
    );

    for (const recital of docData.recitals) {
      children.push(
        new Paragraph({
          spacing: { after: 140 },
          children: [
            new TextRun({
              text: recital,
              italics: recital.startsWith('WHEREAS'),
              size: 20,
            }),
          ],
        })
      );
    }
  }

  // Sections
  for (const section of docData.sections) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 100 },
        children: [
          new TextRun({
            text: `SECTION ${section.sectionNumber}. ${section.title}`,
            bold: true,
            size: 22,
            color: '0F172A',
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: section.content,
            size: 20,
          }),
        ],
      })
    );

    if (section.subclauses && section.subclauses.length > 0) {
      for (const sub of section.subclauses) {
        children.push(
          new Paragraph({
            spacing: { after: 100 },
            indent: { left: 400 },
            children: [
              new TextRun({
                text: sub,
                size: 20,
              }),
            ],
          })
        );
      }
    }
  }

  // Signatures
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 160 },
      children: [
        new TextRun({
          text: 'EXECUTION AND SIGNATURE BLOCKS',
          bold: true,
          size: 22,
          color: '0F172A',
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date.',
          italics: true,
          size: 20,
        }),
      ],
    })
  );

  // Signatures Table (Side by Side)
  const sigPartyA = docData.signatures.partyA;
  const sigPartyB = docData.signatures.partyB;

  const signaturesTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({ children: [new TextRun({ text: sigPartyA.role.toUpperCase(), bold: true, size: 18 })] }),
              new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: 'Signature: __________________________', size: 18 })] }),
              new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: `Printed Name: ${sigPartyA.name}`, size: 18 })] }),
              new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: `Title: ${sigPartyA.title || 'Authorized Signatory'}`, size: 18 })] }),
              new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: `Date: ${sigPartyA.signatureDate || docData.effectiveDate}`, size: 18 })] }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({ children: [new TextRun({ text: sigPartyB.role.toUpperCase(), bold: true, size: 18 })] }),
              new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: 'Signature: __________________________', size: 18 })] }),
              new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: `Printed Name: ${sigPartyB.name}`, size: 18 })] }),
              new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: `Title: ${sigPartyB.title || 'Authorized Signatory'}`, size: 18 })] }),
              new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: `Date: ${sigPartyB.signatureDate || docData.effectiveDate}`, size: 18 })] }),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(signaturesTable);

  // Legal Disclaimer Footer
  children.push(
    new Paragraph({
      spacing: { before: 400, after: 100 },
      children: [
        new TextRun({
          text: `DISCLAIMER: ${docData.legalDisclaimer}`,
          italics: true,
          size: 16,
          color: '718096',
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  const sanitizedName = (docData.title || 'Legal_Agreement')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_');
  anchor.download = `${sanitizedName}_${docData.documentId}.docx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}
