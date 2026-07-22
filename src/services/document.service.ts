// src/services/document.service.ts

export const documentService = {
  // ফাইল বাফার থেকে টেক্সট এক্সট্র্যাক্ট করুন (ফাইলের ধরন অনুযায়ী)
  async extractText(buffer: Buffer, fileType: string): Promise<string> {
    try {
      if (fileType === 'txt') {
        return buffer.toString('utf-8');
      }

      if (fileType === 'pdf') {
        // ডাইনামিক ইমপোর্ট - শুধু প্রয়োজনে লোড হয় (সার্ভারলেস কোল্ড স্টার্ট দ্রুত রাখতে)
        const pdfParse = (await import('pdf-parse')).default;
        const data = await pdfParse(buffer);
        return data.text;
      }

      if (fileType === 'docx' || fileType === 'doc') {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
      }

      throw new Error('অসমর্থিত ফাইল ধরন');
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error('ফাইল থেকে টেক্সট বের করা যায়নি');
    }
  },

  // ফাইল এক্সটেনশন থেকে ফাইল টাইপ নির্ধারণ করুন
  getFileType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    return ext;
  },

  // ফাইল টাইপ সমর্থিত কিনা যাচাই করুন
  isSupportedType(fileType: string): boolean {
    return ['pdf', 'docx', 'doc', 'txt'].includes(fileType);
  },
};
