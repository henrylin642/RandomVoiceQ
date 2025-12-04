import React, { useState, useEffect } from 'react';
import { Settings, Shuffle } from 'lucide-react';
import { TTSProvider } from '@/utils/tts';

interface ControlPanelProps {
    onRandom: () => void;
    totalQuestions: number;
    onConfigChange: (config: any) => void;
}

export default function ControlPanel({ onRandom, totalQuestions, onConfigChange }: ControlPanelProps) {
    const [showSettings, setShowSettings] = useState(false);
    const [provider, setProvider] = useState<TTSProvider>('browser');
    const [azureKey, setAzureKey] = useState('');
    const [azureRegion, setAzureRegion] = useState('');

    useEffect(() => {
        const savedConfig = localStorage.getItem('ttsConfig');
        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig);
                setProvider(parsed.provider || 'browser');
                setAzureKey(parsed.azureKey || process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '');
                setAzureRegion(parsed.azureRegion || process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || '');
                onConfigChange(parsed);
            } catch (e) {
                console.error("Failed to parse saved TTS config", e);
            }
        } else {
            // Load from env if no saved config
            const envKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '';
            const envRegion = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || '';
            if (envKey && envRegion) {
                setProvider('azure');
                setAzureKey(envKey);
                setAzureRegion(envRegion);
                onConfigChange({ provider: 'azure', azureKey: envKey, azureRegion: envRegion });
            }
        }
    }, []);

    const handleConfigUpdate = (newProvider: TTSProvider, newKey: string, newRegion: string) => {
        setProvider(newProvider);
        setAzureKey(newKey);
        setAzureRegion(newRegion);
        const config = { provider: newProvider, azureKey: newKey, azureRegion: newRegion };
        onConfigChange(config);
        localStorage.setItem('ttsConfig', JSON.stringify(config));
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onRandom}
                        disabled={totalQuestions === 0}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                        <Shuffle size={20} />
                        Random Question
                    </button>
                    <span className="text-gray-500 font-medium">
                        Total Questions: <span className="text-gray-900">{totalQuestions}</span>
                    </span>
                </div>

                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Settings size={18} />
                    TTS Settings
                </button>
            </div>

            {showSettings && (
                <div className="mt-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200 animate-in slide-in-from-top-2">
                    <h3 className="font-semibold text-gray-800 mb-4">Text-to-Speech Settings</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={provider === 'browser'}
                                        onChange={() => handleConfigUpdate('browser', azureKey, azureRegion)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>Browser Default (Free)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={provider === 'azure'}
                                        onChange={() => handleConfigUpdate('azure', azureKey, azureRegion)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>Azure TTS (High Quality)</span>
                                </label>
                            </div>
                        </div>

                        {provider === 'azure' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Azure Region</label>
                                    <input
                                        type="text"
                                        value={azureRegion}
                                        onChange={(e) => handleConfigUpdate('azure', azureKey, e.target.value)}
                                        placeholder="e.g. eastus"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                                    <input
                                        type="password"
                                        value={azureKey}
                                        onChange={(e) => handleConfigUpdate('azure', e.target.value, azureRegion)}
                                        placeholder="Enter your Azure Speech Key"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
