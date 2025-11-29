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
    당신은 2025년 최신 Threads 및 인스타그램 알고리즘을 완벽하게 파악한 '바이럴 콘텐츠 전략가'입니다.
    단순한 글짓기가 아니라, 사용자의 **스크롤을 멈추게(Stop Scroll)** 하고 **반응(댓글, 공유)을 이끌어내는** 것이 유일한 목표입니다.

    [입력 데이터]
    - 주제(Theme): ${theme}
    - 타겟 감정(Emotion): ${emotion}
    - 비주얼 스타일: ${imageStyle}

    [최강 노출을 위한 알고리즘 해킹 전략]
    1. **The Curiosity Gap (호기심 공백):** 정보를 다 주지 마세요. 문장을 읽고 나서 "그래서?" 혹은 "진짜?"라는 궁금증이 폭발하게 만드세요.
    2. **Contrarian (반전/논쟁):** 대다수가 믿는 통념을 깨부수거나, 뻔한 위로 대신 뼈 때리는 현실을 말하세요.
    3. **Deep Relatability (극단적 공감):** "이거 완전 내 얘긴데?" 싶을 정도로 구체적인 상황을 묘사하여 '저장'과 '공유'를 유도하세요.
    4. **Hook First:** 첫 5어절 안에 승부를 봅니다. 지루한 서론은 절대 금지입니다.

    [작성 규칙]
    1️⃣ **바이럴 훅 (첫 문장 - 한글):**
       - **절대 금지:** "~해요", "~습니다" 같은 설명조 어미. "오늘은..."으로 시작하는 일기장 스타일.
       - **권장:** 짧고 강렬한 단문. 질문형(?), 도발적인 선언(!), 혹은 말하다 만 듯한 여운(...).
       - 문장은 40자 이내로 모바일 가독성을 극대화하세요.
       - 감정을 직접 설명하지 말고, 그 감정이 드는 **'구체적인 찰나의 순간'**을 포착하세요.
    
    2️⃣ **이미지 프롬프트 (영어):**
       - 피드에서 시선을 강탈하는 **High Contrast(고대비)**, **Center Composition(중앙 구도)**.
       - ${imageStyle} 스타일을 적용하되, 복잡한 배경을 제거하고 피사체를 강조하여 작은 모바일 화면에서도 명확하게 보이게 하세요.
       - 텍스트가 들어갈 여백(Negative Space)을 고려한 구도를 잡으세요.

    [출력 형식 - 변경 불가]
    반드시 아래 형식을 그대로 지켜주세요.

    ✨ 노출 최적화 첫 문장:
    (여기에 완성된 훅 작성)
    🖼️ 이미지 프롬프트:
    (여기에 완성된 영어 이미지 프롬프트 작성)
  `;

  try {
    const response = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        temperature: 0.85, // 독창적이고 예상치 못한 훅을 위해 온도 상향
      }
    });
    const text = response.text;
    
    const sentenceMatch = text.match(/✨ 노출 최적화 첫 문장:\s*([\s\S]*?)(?=🖼️|$)/);
    const imagePromptMatch = text.match(/🖼️ 이미지 프롬프트:\s*([\s\S]*)/);
    
    if (!sentenceMatch || !imagePromptMatch) {
      console.error("Failed to parse model response:", text);
      throw new Error("모델 응답 형식이 올바르지 않습니다. 다시 시도해주세요.");
    }

    const sentence = sentenceMatch[1].trim();
    const imagePrompt = imagePromptMatch[1].trim();

    return { sentence, imagePrompt };
  } catch (error) {
    console.error("Error generating sentence and prompt:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("알고리즘 분석 중 오류가 발생했습니다.");
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
              aspectRatio: '1:1', // 인스타그램/스레드 피드 최적화
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("이미지 생성에 실패했습니다.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        if (error instanceof Error) {
            throw new Error(`이미지 생성 실패: ${error.message}`);
        }
        throw new Error("이미지 생성 중 오류가 발생했습니다.");
    }
}

export const generateEmotionalCopy = async (
    imageBase64: string,
    imageMimeType: string,
    intensity: number,
    style: string
): Promise<EmotionalCopyResult> => {
    const prompt = `
        당신은 수만 팔로워를 보유한 '감성 큐레이터'입니다.
        이 사진을 보고 사람들이 '저장' 버튼을 누르게 만들 감성 카피를 작성하세요.

        [입력 정보]
        - 감정 농도: ${intensity} (1: 담백/시크 ~ 10: 깊은 울림/새벽 2시)
        - 톤앤매너: ${style}

        [트렌드 반영 작성법]
        1. **설명하지 마세요:** 사진에 보이는 걸 그대로 쓰지 마세요. 사진 밖의 이야기를 상상하게 만드세요.
        2. **여백의 미:** 구구절절 긴 문장보다, 짧게 끊어치는 문장이 더 울림이 큽니다.
        3. **Nostalgia (향수):** 누구나 겪었을 법한 지난 기억을 자극하세요.

        [출력 형식]
        ✨ 감정 요약:
        (핵심 키워드나 짧은 분위기 묘사)
        💬 문장 1:
        (카피 1)
        💬 문장 2:
        (카피 2)
        💬 문장 3:
        (카피 3)
        💬 문장 4:
        (카피 4)
        💬 문장 5:
        (카피 5)
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
             throw new Error("감성 분석 결과 형식이 올바르지 않습니다.");
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
        throw new Error("감성 분석 중 오류가 발생했습니다.");
    }
};