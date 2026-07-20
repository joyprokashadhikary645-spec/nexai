// src/types/pdf-parse.d.ts
// pdf-parse প্যাকেজের অফিসিয়াল TypeScript টাইপ নেই, তাই নিজস্ব ডিক্লারেশন

declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: unknown;
    version: string;
  }

  function pdfParse(buffer: Buffer): Promise<PDFData>;
  export default pdfParse;
}
