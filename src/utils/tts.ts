import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export type TTSProvider = 'browser' | 'azure';

interface TTSConfig {
    provider: TTSProvider;
    azureRegion?: string;
    azureKey?: string;
}

export const speak = async (
    text: string,
    lang: 'zh-TW' | 'en-US',
    config: TTSConfig
) => {
    if (!text) return;

    if (config.provider === 'azure' && config.azureKey && config.azureRegion) {
        await speakAzure(text, lang, config.azureKey, config.azureRegion);
    } else {
        speakBrowser(text, lang);
    }
};

const speakBrowser = (text: string, lang: string) => {
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
};

const speakAzure = (
    text: string,
    lang: string,
    key: string,
    region: string
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
        speechConfig.speechSynthesisLanguage = lang;

        // Select specific voices for better quality if desired, or let Azure pick default for lang
        if (lang === 'zh-TW') {
            speechConfig.speechSynthesisVoiceName = "zh-TW-HsiaoChenNeural";
        } else {
            speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
        }

        const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

        synthesizer.speakTextAsync(
            text,
            (result) => {
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    resolve();
                } else {
                    console.error("Azure TTS Error Details:", result.errorDetails);
                    reject(new Error(`Azure TTS Failed: ${result.errorDetails}`));
                }
                synthesizer.close();
            },
            (err) => {
                console.error("Azure TTS Network/System Error:", err);
                reject(err);
                synthesizer.close();
            }
        );
    });
};
