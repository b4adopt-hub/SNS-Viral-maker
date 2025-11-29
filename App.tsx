import React, { useState, useCallback, useRef, useEffect } from 'react';
import { generateSentenceAndPrompt, generateImage, generateEmotionalCopy, EmotionalCopyResult } from './services/geminiService.ts';

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.19c-2.818 0-5.436.85-7.685 2.45A.75.75 0 01.63 16.5c1.28-2.28 2.834-4.293 4.89-5.882a.75.75 0 01.81.093c.883.693 1.84 1.255 2.87.168a.75.75 0 01.115-1.299z" clipRule="evenodd" />
  </svg>
);

const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25-2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V6c0-.414.336-.75.75-.75h16.5a.75.75 0 01.75.75v10.06l-3.56-3.56a.75.75 0 00-1.06 0l-3.06 3.06a.75.75 0 01-1.06 0l-1.72-1.72a.75.75 0 00-1.06 0l-4.28 4.28zM5.25 9.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
    </svg>
);

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M11.25 3.75c.414 0 .75.336.75.75v.008l.006 8.494 2.27-2.27a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.27 2.27V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
      <path d="M3.75 16.5a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
    </svg>
);


const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M10.5 3A2.5 2.5 0 008 5.5v2.33a3.003 3.003 0 00-2.032.938 3.5 3.5 0 00-.968 2.032V18a3.5 3.5 0 003.5 3.5h7a3.5 3.5 0 003.5-3.5v-7.199a3.5 3.5 0 00-.968-2.032A3.003 3.003 0 0016 7.83V5.5A2.5 2.5 0 0013.5 3h-3zm-1 2.5a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5v2.099a4.503 4.503 0 013 3.301V18a2.5 2.5 0 01-2.5-2.5h-7a2.5 2.5 0 01-2.5-2.5v-7.099a4.503 4.503 0 013-3.301V5.5z" clipRule="evenodd" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
     <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
    </svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z" />
    </svg>
);

const ArrowPathIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-4.518a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h5.25a.75.75 0 00.75-.75v-5.25a.75.75 0 00-.75-.75h-.008a.75.75 0 00-.75.75v1.838l-1.94-1.94A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.498 3.886a.75.75 0 00-1.449-.388A7.5 7.5 0 016.903 16.03l-1.902-1.903h4.517a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75h-5.25a.75.75 0 00-.75.75v5.25a.75.75 0 00.75.75h.008a.75.75 0 00.75-.75v-1.838l1.94 1.94a9 9 0 0013.232-4.275z" clipRule="evenodd" />
    </svg>
);

const SpeakerOnIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 4.06c0-1.34-1.61-2.26-2.79-1.55L5.12 6H3c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h2.12l5.59 3.49c1.18.71 2.79-.21 2.79-1.55V4.06zM18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM16 4.26v2.09c2.33.82 4 3.04 4 5.65s-1.67 4.83-4 5.65v2.09c3.45-.89 6-4.01 6-7.74s-2.55-6.85-6-7.74z" />
    </svg>
);

const SpeakerOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3.63 3.63a.75.75 0 00-1.06 1.06L5.28 7.4H3a.75.75 0 00-.75.75v7.5c0 .414.336.75.75.75h2.28l4.47 2.98a.75.75 0 001.25-.6V12.2l3.44 3.44a4.5 4.5 0 01-5.44 1.03L10.5 18.4v-3.28l-2.72-2.72H6V9.1l-2.37-2.37zM16.5 12a4.5 4.5 0 00-1.56-3.44L12.9 10.5a2.99 2.99 0 010 3l2.05 2.05A4.48 4.48 0 0016.5 12zM18.97 6.03a.75.75 0 00-1.06-1.06L16.44 6.44A7.5 7.5 0 0010.5 3.52v1.53l-2.4-2.4a.75.75 0 00-1.06 1.06l14.47 14.47a.75.75 0 101.06-1.06L18.97 6.03z"/>
    </svg>
);


const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-indigo-300 animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 rounded-full bg-indigo-300 animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 rounded-full bg-indigo-300 animate-pulse"></div>
    </div>
);

type SoundType = 'click' | 'success' | 'error';

const useSoundEffects = () => {
    const [isMuted, setIsMuted] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);

    const playSound = useCallback((type: SoundType) => {
        if (isMuted) return;

        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            if (!ctx) return;
            
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            gainNode.connect(ctx.destination);
            oscillator.connect(gainNode);

            const now = ctx.currentTime;
            gainNode.gain.setValueAtTime(0.2, now);

            switch (type) {
                case 'click':
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(880, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
                    oscillator.start(now);
                    oscillator.stop(now + 0.1);
                    break;
                case 'success':
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(523.25, now);
                    oscillator.frequency.setValueAtTime(659.25, now + 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
                    oscillator.start(now);
                    oscillator.stop(now + 0.2);
                    break;
                case 'error':
                    oscillator.type = 'square';
                    oscillator.frequency.setValueAtTime(160, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
                    oscillator.start(now);
                    oscillator.stop(now + 0.2);
                    break;
            }
        } catch (e) {
            console.error("Could not play sound", e);
        }
    }, [isMuted]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
        if(!isMuted) playSound('click');
    }, [isMuted, playSound]);
    
    useEffect(() => {
        const cleanup = () => {
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close().catch(console.error);
            }
        };
        return cleanup;
    }, []);

    return { isMuted, toggleMute, playSound };
};

interface InputFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    maxLength?: number;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, value, onChange, placeholder, maxLength }) => (
    <div>
        <div className="flex justify-between items-baseline mb-2">
            <label htmlFor={id} className="text-sm font-medium text-indigo-200">{label}</label>
            {maxLength && (
                 <span className={`text-xs font-mono transition-colors duration-200 ${value.length > maxLength ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {value.length}/{maxLength}
                </span>
            )}
        </div>
        <input
            type="text"
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
        />
    </div>
);

const imageStyles = [
    { value: 'Photorealistic', label: '실사 (트래픽 높음)' },
    { value: 'Minimalist', label: '미니멀리스트 (감성)' },
    { value: 'High Contrast Black and White', label: '흑백 고대비 (시선 집중)' },
    { value: 'Vibrant Pop Art', label: '비비드 팝아트' },
    { value: 'Cinematic', label: '시네마틱' },
    { value: 'Film Photography', label: '필름 그레인' },
    { value: 'Cyberpunk', label: '사이버펑크' },
    { value: 'Anime', label: '애니메이션' },
    { value: 'Abstract', label: '추상화' },
    { value: 'Ghibli Studio style', label: '지브리 스타일' },
];

interface SelectFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({ id, label, value, onChange, options }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-indigo-200">{label}</label>
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 appearance-none"
                aria-label={label}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-800 text-white">{option.label}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    </div>
);

interface CopyButtonProps {
    textToCopy: string;
    playSound: (type: SoundType) => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, playSound }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        playSound('click');
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('클립보드 복사에 실패했습니다: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="transition-all duration-200 ease-in-out"
            aria-label="클립보드로 복사"
        >
            {isCopied ? (
                <span className="flex items-center text-green-400">
                    <CheckIcon className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">복사됨!</span>
                </span>
            ) : (
               <span className="flex items-center text-gray-400 hover:text-white" title="복사하기">
                 <ClipboardIcon className="w-4 h-4" />
               </span>
            )}
        </button>
    );
};

interface ShareButtonProps {
    sentence: string;
    imageUrl: string;
    playSound: (type: SoundType) => void;
}

const ShareButton: React.FC<ShareButtonProps> = ({ sentence, imageUrl, playSound }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        if (!sentence || !imageUrl || isCopied) return;
        playSound('click');
        const textToCopy = `${sentence}\n\n${imageUrl}`;
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('클립보드 복사에 실패했습니다: ', err);
        }
    };

    return (
        <button
            onClick={handleShare}
            disabled={isCopied}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
            aria-label="결과 공유하기"
        >
            {isCopied ? (
                <>
                    <CheckIcon className="w-5 h-5" />
                    <span>복사 완료!</span>
                </>
            ) : (
                <>
                    <ShareIcon className="w-5 h-5" />
                    <span>바이럴 포스트 복사</span>
                </>
            )}
        </button>
    );
};

interface GeneratorProps {
    playSound: (type: SoundType) => void;
}

const SentenceGenerator: React.FC<GeneratorProps> = ({ playSound }) => {
    const [theme, setTheme] = useState<string>('');
    const [emotion, setEmotion] = useState<string>('');
    const [imageStyle, setImageStyle] = useState<string>(imageStyles[0].value);
    const [generatedSentence, setGeneratedSentence] = useState<string | null>(null);
    const [generatedImagePrompt, setGeneratedImagePrompt] = useState<string | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isLoadingText, setIsLoadingText] = useState<boolean>(false);
    const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [lastParams, setLastParams] = useState<{ theme: string; emotion: string; imageStyle: string; } | null>(null);

    const handleGenerate = useCallback(async (params?: { theme: string; emotion: string; imageStyle: string; }) => {
        const paramsToUse = params || { theme, emotion, imageStyle };
        const themeTrimmed = paramsToUse.theme.trim();
        const emotionTrimmed = paramsToUse.emotion.trim();

        if (!themeTrimmed) {
            setError('주제를 입력해주세요.');
            playSound('error');
            return;
        }

        if (!emotionTrimmed) {
            setError('감정을 입력해주세요.');
            playSound('error');
            return;
        }

        setIsLoadingText(true);
        setIsLoadingImage(false);
        setError(null);
        setGeneratedSentence(null);
        setGeneratedImagePrompt(null);
        setGeneratedImageUrl(null);
        setLastParams(paramsToUse);

        let success = false;
        try {
            const { sentence, imagePrompt } = await generateSentenceAndPrompt(themeTrimmed, emotionTrimmed, paramsToUse.imageStyle);
            setGeneratedSentence(sentence);
            setGeneratedImagePrompt(imagePrompt);
            setIsLoadingText(false);

            setIsLoadingImage(true);
            const imageUrl = await generateImage(imagePrompt);
            setGeneratedImageUrl(imageUrl);
            success = true;
        } catch (e) {
            const err = e as Error;
            setError(err.message);
            playSound('error');
        } finally {
            setIsLoadingText(false);
            setIsLoadingImage(false);
            if (success) {
                playSound('success');
            }
        }
    }, [theme, emotion, imageStyle, playSound]);

    const handleRetry = useCallback(() => {
        if (lastParams) {
            handleGenerate(lastParams);
        }
    }, [lastParams, handleGenerate]);
    
    const isGenerating = isLoadingText || isLoadingImage;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                    id="theme"
                    label="콘텐츠 주제"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="예: 퇴사, 연애, 갓생"
                    maxLength={20}
                />
                <InputField
                    id="emotion"
                    label="타겟 감정 (반응 유도)"
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                    placeholder="예: 분노, 공감, 킹받음"
                    maxLength={20}
                />
                <SelectField
                    id="imageStyle"
                    label="노출 최적화 스타일"
                    value={imageStyle}
                    onChange={(e) => setImageStyle(e.target.value)}
                    options={imageStyles}
                />
            </div>
            
            <div className="flex items-stretch gap-3">
                <button
                    onClick={() => { playSound('click'); handleGenerate(); }}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-800 disabled:to-purple-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 shadow-lg"
                >
                    {isLoadingText ? (
                        <>
                            <LoadingSpinner />
                            <span>알고리즘 해킹 중...</span>
                        </>
                    ) : isLoadingImage ? (
                        <>
                            <ImageIcon className="w-5 h-5 animate-spin" />
                            <span>고효율 이미지 렌더링...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            <span>알고리즘 최적화 생성</span>
                        </>
                    )}
                </button>
                {lastParams && !isGenerating && (
                    <button
                        onClick={() => { playSound('click'); handleRetry(); }}
                        className="flex-shrink-0 flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-bold p-3 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
                        aria-label="다시 생성"
                        title="다른 버전으로 다시 생성"
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                    {error}
                </div>
            )}

            {(generatedSentence || isGenerating) && (
                <div className="pt-6">
                    <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-6 animate-fade-in space-y-4">
                        {isLoadingText && (
                            <div className="text-center text-gray-400">
                                <LoadingSpinner />
                                <p className="mt-2 text-sm text-indigo-300">최신 트렌드와 훅(Hook)을 분석하고 있습니다...</p>
                            </div>
                        )}
                        {generatedSentence && (
                            <div className="transition-transform duration-300 hover:scale-105 cursor-pointer" onClick={() => {
                                navigator.clipboard.writeText(generatedSentence);
                                playSound('click');
                            }}>
                                <div className="flex justify-between items-center">
                                    <p className="text-indigo-300 font-semibold text-xs uppercase tracking-wider">🔥 Stop Scroll Hook</p>
                                    <CopyButton textToCopy={generatedSentence} playSound={playSound} />
                                </div>
                                <p className="text-white text-xl md:text-3xl font-black mt-2 leading-snug tracking-tight drop-shadow-lg">{generatedSentence}</p>
                            </div>
                        )}
                        {generatedImagePrompt && (
                             <div className="opacity-75">
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-indigo-300 font-semibold text-sm">🖼️ AI 프롬프트 (High Engagement):</p>
                                    <CopyButton textToCopy={generatedImagePrompt} playSound={playSound} />
                                </div>
                                <p className="text-gray-400 text-sm mt-1 italic">"{generatedImagePrompt}"</p>
                            </div>
                        )}
                        
                        <div className="mt-4">
                            {isLoadingImage && (
                                <div className="aspect-square bg-slate-800/50 rounded-lg flex flex-col justify-center items-center text-gray-400 transition-all duration-300 border border-slate-700 border-dashed">
                                    <ImageIcon className="w-12 h-12 text-gray-500 animate-pulse" />
                                    <p className="mt-2 text-sm">피드 장악 이미지 생성 중...</p>
                                </div>
                            )}
                            {generatedImageUrl && (
                                <img src={generatedImageUrl} alt={generatedImagePrompt || 'Generated image'} className="w-full h-auto rounded-lg shadow-2xl aspect-square object-cover transition-transform duration-300 hover:scale-[1.02] ring-1 ring-gray-700" />
                            )}
                        </div>
                        {generatedSentence && generatedImageUrl && (
                            <ShareButton sentence={generatedSentence} imageUrl={generatedImageUrl} playSound={playSound} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const EmotionalCopywriter: React.FC<GeneratorProps> = ({ playSound }) => {
    const [image, setImage] = useState<{ file: File | null; base64: string | null; preview: string | null; mimeType: string | null }>({ file: null, base64: null, preview: null, mimeType: null });
    const [intensity, setIntensity] = useState(5);
    const [style, setStyle] = useState<string>('새벽 감성');
    const [result, setResult] = useState<EmotionalCopyResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imagePreviewRef = useRef<HTMLImageElement>(null);
    
    const writingStyles = [
        { value: '새벽 감성', label: '새벽 감성 (저장 유도)' },
        { value: '담백한 기록', label: '담백한 기록 (라이프스타일)' },
        { value: '짧은 시', label: '짧은 시 (여운)' },
        { value: '영화 대사처럼', label: '영화 대사처럼 (공유)' },
    ];

    useEffect(() => {
        if (imagePreviewRef.current && image.preview) {
            imagePreviewRef.current.src = image.preview;
        }
    }, [image.preview]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setError(null);
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result;
                if (typeof dataUrl === 'string') {
                    setImage({
                        file,
                        preview: dataUrl,
                        base64: dataUrl.split(',')[1],
                        mimeType: file.type,
                    });
                    playSound('success');
                } else {
                    setError("이미지 파일을 읽는 데 실패했습니다.");
                    playSound('error');
                }
            };
            reader.onerror = () => {
                setError("이미지 파일을 읽는 중 오류가 발생했습니다.");
                playSound('error');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!image.base64 || !image.mimeType) {
            setError('이미지를 먼저 업로드해주세요.');
            playSound('error');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const emotionalCopy = await generateEmotionalCopy(image.base64, image.mimeType, intensity, style);
            setResult(emotionalCopy);
            playSound('success');
        } catch (e) {
            const err = e as Error;
            setError(err.message);
            playSound('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
            />
            {!image.preview ? (
                <button
                    onClick={() => { playSound('click'); fileInputRef.current?.click(); }}
                    className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex flex-col justify-center items-center text-gray-400 hover:border-indigo-500 hover:text-indigo-300 transition-all duration-300 bg-gray-800/30"
                >
                    <UploadIcon className="w-10 h-10 mb-2" />
                    <span>분석할 사진 업로드</span>
                </button>
            ) : (
                <div className="relative">
                    <img ref={imagePreviewRef} alt="Preview" className="w-full rounded-lg shadow-lg" />
                    <button
                        onClick={() => {
                            playSound('click');
                            setImage({ file: null, base64: null, preview: null, mimeType: null });
                            if(fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 transition-all"
                        aria-label="Remove image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="intensity" className="block mb-2 text-sm font-medium text-indigo-200">
                        감정 농도: <span className="font-bold text-white">{intensity}</span>
                    </label>
                    <input
                        id="intensity"
                        type="range"
                        min="1"
                        max="10"
                        value={intensity}
                        onChange={(e) => setIntensity(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
                 <SelectField
                    id="writingStyle"
                    label="문체 톤앤매너"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    options={writingStyles}
                />
            </div>

            <button
                onClick={() => { playSound('click'); handleGenerate(); }}
                disabled={isLoading || !image.file}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
            >
                {isLoading ? (
                    <>
                        <LoadingSpinner />
                        <span>사진 감성 분석 중...</span>
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5" />
                        <span>감성 카피 생성</span>
                    </>
                )}
            </button>
            
            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                    {error}
                </div>
            )}
            
            {(result || isLoading) && (
                 <div className="pt-6">
                     <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-6 animate-fade-in space-y-4">
                        {isLoading && (
                             <div className="text-center text-gray-400">
                                <LoadingSpinner />
                                <p className="mt-2 text-sm">AI가 사진의 무드를 텍스트로 변환 중...</p>
                            </div>
                        )}
                        {result && (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-indigo-300 font-semibold text-sm">✨ 감성 분석 결과:</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-white text-lg italic">"{result.summary}"</p>
                                        <CopyButton textToCopy={result.summary} playSound={playSound} />
                                    </div>
                                </div>
                                {result.sentences.map((sentence, index) => (
                                    <div key={index} className="border-t border-gray-800 pt-3 mt-3 first:border-0 first:pt-0 first:mt-0">
                                        <p className="text-indigo-300 font-semibold text-xs mb-1">✍️ 옵션 {index + 1}:</p>
                                        <div className="flex justify-between items-start">
                                            <p className="text-white text-lg leading-relaxed">{sentence}</p>
                                            <div className="flex-shrink-0 ml-2">
                                                <CopyButton textToCopy={sentence} playSound={playSound} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                     </div>
                 </div>
            )}
        </div>
    );
};

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'sentence' | 'emotion'>('sentence');
    const { isMuted, toggleMute, playSound } = useSoundEffects();

    const getTabClass = (tabName: 'sentence' | 'emotion') => {
        const baseClass = "py-3 px-6 text-center font-semibold rounded-t-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-1/2";
        if (activeTab === tabName) {
            return `${baseClass} bg-slate-800/50 text-white border-t border-l border-r border-slate-700 relative z-10`;
        }
        return `${baseClass} bg-transparent text-gray-500 hover:bg-slate-700/30 hover:text-gray-200 border-b border-slate-700`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 text-white p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans">
            <div className="w-full max-w-2xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2 drop-shadow-sm">
                        SNS 바이럴 훅 메이커
                    </h1>
                    <p className="text-lg text-gray-400 font-medium">알고리즘이 선택하는 최적의 한 문장</p>
                </header>
                
                <div className="flex mb-[-1px]">
                     <button onClick={() => { playSound('click'); setActiveTab('sentence'); }} className={getTabClass('sentence')}>
                        🔥 바이럴 훅 생성
                    </button>
                    <button onClick={() => { playSound('click'); setActiveTab('emotion'); }} className={getTabClass('emotion')}>
                        💧 감성 카피라이터
                    </button>
                </div>

                <main className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-b-xl rounded-tr-xl shadow-2xl p-6 sm:p-8 relative z-0">
                    {activeTab === 'sentence' && <SentenceGenerator playSound={playSound} />}
                    {activeTab === 'emotion' && <EmotionalCopywriter playSound={playSound} />}
                </main>
                
                <footer className="text-center mt-8 text-gray-600 text-xs flex justify-center items-center gap-4">
                    <p>Powered by Google Gemini 2.5 Flash</p>
                    <button 
                        onClick={toggleMute} 
                        className="text-gray-500 hover:text-white transition-colors"
                        aria-label={isMuted ? "소리 켜기" : "소리 끄기"}
                        title={isMuted ? "소리 켜기" : "소리 끄기"}
                    >
                        {isMuted ? <SpeakerOffIcon className="w-4 h-4" /> : <SpeakerOnIcon className="w-4 h-4" />}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default App;