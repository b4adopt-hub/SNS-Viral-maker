import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const textModel = 'gemini-2.5-flash';
const imageModel = 'imagen-4.0-generate-001';

export interface GenerationResult {
    sentence: string;
    imagePrompt: string;
}

export interface EmotionalCopyResult {
    summary: string;
    sentences: string[];
}

export const generateSentenceAndPrompt = async (theme: string, emotion: string, imageStyle: string): Promise<GenerationResult> => {
  const prompt = `
    당신은 2025년 최신 Threads 및 인스타그램 알고리즘을 마스터한 '바이럴 콘텐츠 전략가'입니다.
    당신의 목표는 사용자가 스크롤을 멈추게 만드는 '강력한 첫 문장(Hook)'과 '클릭을 유도하는 이미지 프롬프트'를 만드는 것입니다.

    [입력 데이터]
    - 주제(Theme): ${theme}
    - 감정(Emotion): ${emotion}
    - 이미지 스타일(Image Style): ${imageStyle}

    [최신 알고리즘 기반 작성 전략]
    1. **The Gap Theory (공백 이론):** 독자의 호기심을 자극하여 "더 보기"를 누르게 만드세요.
    2. **Deep Relatability (깊은 공감):** "나만 이런 게 아니구나"라는 안도감을 주거나, "내 얘기네"라는 반응을 이끌어내세요.
    3. **Contrarian (반전/논쟁):** 일반적인 통념을 뒤집는 문장으로 댓글 참여를 유도하세요.
    4. **Short & Punchy:** 모바일 환경에서 가독성이 좋도록 40자 이내로 짧게 끊으세요.

    [작성 규칙]
    1️⃣ **첫 문장 (한글):**
       - 단순한 설명 금지. (X: 오늘은 날씨가 좋다. -> O: 날씨가 좋아서 퇴사하고 싶어졌다.)
       - 질문형(?), 선언형(!), 혹은 독백형(...)을 적절히 섞어 가장 '도파민'을 자극하는 문장 하나만 출력하세요.
       - 입력된 '감정'을 직접 언급하지 말고, 상황이나 뉘앙스로 보여주세요 (Show, Don't Tell).
    
    2️⃣ **이미지 프롬프트 (영어):**
       - SNS 피드에서 눈에 띄도록 **고대비(High Contrast)**, **중앙 구도(Center Composition)**, **심미적 조명(Aesthetic Lighting)**을 강조하세요.
       - ${imageStyle} 스타일을 기반으로 하되, 복잡한 디테일보다는 직관적이고 감각적인 비주얼을 묘사하세요.

    [출력 형식]
    반드시 아래 형식을 지켜주세요.

    ✨ 노출 최적화 첫 문장:
    (여기에 완성된 한글 문장 작성)
    🖼️ 이미지 프롬프트:
    (여기에 완성된 영어 이미지 프롬프트 작성)
  `;

  try {
    const response = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        temperature: 0.8, // 창의성을 높여 다양한 훅 생성
      }
    });
    const text = response.text;
    
    const sentenceMatch = text.match(/✨ 노출 최적화 첫 문장:\s*([\s\S]*?)(?=🖼️|$)/);
    const imagePromptMatch = text.match(/🖼️ 이미지 프롬프트:\s*([\s\S]*)/);
    
    if (!sentenceMatch || !imagePromptMatch) {
      console.error("Failed to parse model response:", text);
      throw new Error("모델 응답을 분석하는 데 실패했습니다. 형식이 예상과 다릅니다.");
    }

    const sentence = sentenceMatch[1].trim();
    const imagePrompt = imagePromptMatch[1].trim();

    return { sentence, imagePrompt };
  } catch (error) {
    console.error("Error generating sentence and prompt:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: imageModel,
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("생성된 이미지가 없습니다.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        if (error instanceof Error) {
            throw new Error(`이미지 생성 중 오류 발생: ${error.message}`);
        }
        throw new Error("이미지 생성 중 알 수 없는 오류가 발생했습니다.");
    }
}

export const generateEmotionalCopy = async (
    imageBase64: string,
    imageMimeType: string,
    intensity: number,
    style: string
): Promise<EmotionalCopyResult> => {
    const prompt = `
        당신은 감성 에세이 작가이자 인스타그램 감성 계정 운영자입니다.
        사용자가 올린 사진을 분석하여, '저장하고 싶은' 감성 글귀를 작성하세요.

        [입력 정보]
        - 감정 강도: ${intensity} (1: 담백함 ~ 10: 격정적)
        - 문체 스타일: ${style}

        [작성 가이드라인 - 최신 트렌드]
        1. **새벽 감성:** 너무 오글거리지 않으면서도, 마음 한구석을 건드리는 톤앤매너.
        2. **여운:** 문장이 끝난 뒤에도 생각이 나도록 생략과 함축을 사용.
        3. **일상의 낯설게 하기:** 평범한 사물이나 풍경에서 특별한 의미를 찾아내세요.
        4. 문장은 SNS 캡션에 바로 쓸 수 있도록 줄바꿈과 호흡을 고려하세요.

        [출력 형식]
        ✨ 감정 요약:
        (사진의 분위기를 한 단어 또는 짧은 구로 요약)
        💬 문장 1:
        (감성 문장 1)
        💬 문장 2:
        (감성 문장 2)
        💬 문장 3:
        (감성 문장 3)
        💬 문장 4:
        (감성 문장 4)
        💬 문장 5:
        (감성 문장 5)
    `;

    try {
        const imagePart = {
          inlineData: {
            mimeType: imageMimeType,
            data: imageBase64,
          },
        };

        const textPart = {
            text: prompt,
        };

        const response = await ai.models.generateContent({
            model: textModel, 
            contents: { parts: [imagePart, textPart] },
        });

        const text = response.text;
        
        const summaryMatch = text.match(/✨ 감정 요약:\s*(.*)/);
        const sentences = text.match(/💬 문장 \d+:\s*(.*)/g)?.map(s => s.replace(/💬 문장 \d+:\s*/, '').trim()) || [];

        if (!summaryMatch || sentences.length === 0) {
             console.error("Failed to parse emotional copy response:", text);
             throw new Error("감성 문장 응답을 분석하는 데 실패했습니다. 형식이 예상과 다릅니다.");
        }

        return {
            summary: summaryMatch[1].trim(),
            sentences: sentences,
        };
    } catch (error) {
        console.error("Error generating emotional copy:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("감성 문장 생성 중 알 수 없는 오류가 발생했습니다.");
    }
};