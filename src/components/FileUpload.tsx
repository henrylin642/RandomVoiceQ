import React, { useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import { parseExcel, Question } from '@/utils/excel';

interface FileUploadProps {
    onDataLoaded: (questions: Question[]) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
    const handleFile = useCallback(async (file: File) => {
        try {
            const questions = await parseExcel(file);
            onDataLoaded(questions);
        } catch (error) {
            console.error("Error parsing file:", error);
            alert("Failed to parse Excel file. Please ensure it matches the required format.");
        }
    }, [onDataLoaded]);

    const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);

    const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <label
            className="w-full max-w-2xl mx-auto p-10 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-blue-600"
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            <UploadCloud size={64} />
            <div className="text-center">
                <p className="text-lg font-semibold">Click or Drag & Drop Excel File Here</p>
                <p className="text-sm opacity-70">Supports .xlsx format</p>
            </div>
            <input
                type="file"
                className="hidden"
                accept=".xlsx, .xls"
                onChange={onInputChange}
            />
        </label>
    );
}
