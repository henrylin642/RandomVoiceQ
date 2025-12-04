'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import QuestionCard from '@/components/QuestionCard';
import ControlPanel from '@/components/ControlPanel';
import { Question } from '@/utils/excel';
import { TTSProvider } from '@/utils/tts';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [ttsConfig, setTtsConfig] = useState<{
    provider: TTSProvider;
    azureRegion?: string;
    azureKey?: string;
  }>({ provider: 'browser' });

  const handleDataLoaded = (data: Question[]) => {
    setQuestions(data);
    // Optional: Select first question immediately or wait for user to click Random
  };

  const handleRandom = () => {
    if (questions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            AI Customer Service <span className="text-blue-600">Verification</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your Q&A Excel file to randomly select questions for verification testing.
          </p>
        </div>

        {questions.length === 0 ? (
          <div className="mt-12 animate-in fade-in zoom-in duration-500">
            <FileUpload onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <ControlPanel
              onRandom={handleRandom}
              totalQuestions={questions.length}
              onConfigChange={setTtsConfig}
            />

            {currentQuestion ? (
              <QuestionCard
                question={currentQuestion}
                ttsConfig={ttsConfig}
              />
            ) : (
              <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-xl">Click "Random Question" to start verification</p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setQuestions([]);
                  setCurrentQuestion(null);
                }}
                className="text-sm text-gray-500 hover:text-red-500 underline transition-colors"
              >
                Upload a different file
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
