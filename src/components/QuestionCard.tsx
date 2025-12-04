import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { Question } from '@/utils/excel';
import { speak, TTSProvider } from '@/utils/tts';

interface QuestionCardProps {
    question: Question;
    ttsConfig: {
        provider: TTSProvider;
        azureRegion?: string;
        azureKey?: string;
    };
}

export default function QuestionCard({ question, ttsConfig }: QuestionCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handleSpeak = async (text: string, lang: 'zh-TW' | 'en-US') => {
        if (isPlaying) return;

        try {
            setIsPlaying(true);
            await speak(text, lang, ttsConfig);
        } catch (error: any) {
            console.error("TTS Error:", error);
            alert(`TTS Error: ${error.message || 'Unknown error'}. Please check your API Key and Region.`);
        } finally {
            setIsPlaying(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">Question #{question.id}</h2>
                {isPlaying && <span className="text-sm animate-pulse bg-white/20 px-2 py-1 rounded">Playing Audio...</span>}
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Chinese Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800">中文問題 (Chinese)</h3>
                        <button
                            onClick={() => handleSpeak(question.chineseQuestion, 'zh-TW')}
                            className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                            title="Play Audio"
                        >
                            <Volume2 size={20} />
                        </button>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed min-h-[3rem]">{question.chineseQuestion}</p>

                    <div className="pt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">中文答案</h4>
                        <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap text-sm leading-relaxed border border-gray-100">
                            {question.chineseAnswer}
                        </div>
                    </div>
                </div>

                {/* English Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800">English Question</h3>
                        <button
                            onClick={() => handleSpeak(question.englishQuestion, 'en-US')}
                            className="p-2 rounded-full hover:bg-indigo-100 text-indigo-600 transition-colors"
                            title="Play Audio"
                        >
                            <Volume2 size={20} />
                        </button>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed min-h-[3rem] font-medium">{question.englishQuestion}</p>

                    <div className="pt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">English Answer</h4>
                        <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap text-sm leading-relaxed border border-gray-100">
                            {question.englishAnswer}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
