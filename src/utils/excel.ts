import * as XLSX from 'xlsx';

export interface Question {
  id: number | string;
  chineseQuestion: string;
  chineseAnswer: string;
  englishQuestion: string;
  englishAnswer: string;
}

export const parseExcel = (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Assuming the first row is the header
        // Headers: 編號, 中文問題, 中文答案, English Question, English Answer
        // Index:   0,    1,        2,        3,                4

        const questions: Question[] = [];

        // Start from index 1 to skip header
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row && row.length > 0) {
            // Basic validation to ensure we have at least some data
            if (row[1] || row[3]) {
              questions.push({
                id: row[0] || i, // Fallback to index if ID is missing
                chineseQuestion: row[1] || '',
                chineseAnswer: row[2] || '',
                englishQuestion: row[3] || '',
                englishAnswer: row[4] || '',
              });
            }
          }
        }

        resolve(questions);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
