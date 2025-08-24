import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GEMINI_API_KEY || "AIzaSyArEaQ4G7svUp-Uy9vN080y6bKlrrlN7yU"
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { files, commitMessage } = body;

    if (!files || !Array.isArray(files)) {
      return NextResponse.json(
        { error: "Files array is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const analyses = await Promise.all(
      files.map(async (file: any) => {
        try {
          if (!file.patch) {
            return {
              filename: file.filename,
              status: file.status,
              analysis: "파일에 diff 내용이 없습니다.",
              summary: "변경사항 없음",
              impact: "low",
              changes: [],
            };
          }

          const prompt = `
다음은 Git 커밋의 파일 변경사항입니다. 한국어로 분석해주세요.

파일명: ${file.filename}
상태: ${file.status}
추가된 줄: ${file.additions}
삭제된 줄: ${file.deletions}

Diff 내용:
${file.patch}

커밋 메시지: ${commitMessage || "없음"}

다음 형식으로 분석해주세요:
1. 주요 변경사항 요약 (1-2문장)
2. 변경사항의 목적과 의도
3. 코드의 기능적 변화
4. 잠재적 영향도 (high/medium/low)
5. 주목할만한 개선사항이나 주의사항

분석은 구체적이고 개발자가 이해하기 쉽게 작성해주세요.
`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const analysis = response.text();

          // diff에서 변경된 라인들 추출
          const changes = extractChanges(file.patch);

          return {
            filename: file.filename,
            status: file.status,
            additions: file.additions,
            deletions: file.deletions,
            analysis: analysis,
            summary: analysis.split("\n")[0] || "변경사항 분석됨",
            impact: extractImpact(analysis),
            changes: changes,
          };
        } catch (error) {
          console.error(`Error analyzing file ${file.filename}:`, error);
          return {
            filename: file.filename,
            status: file.status,
            analysis: "분석 중 오류가 발생했습니다.",
            summary: "분석 실패",
            impact: "unknown",
            changes: [],
          };
        }
      })
    );

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error("Error in analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze changes" },
      { status: 500 }
    );
  }
}

function extractChanges(
  patch: string
): Array<{ type: string; line: string; lineNumber?: number }> {
  const lines = patch.split("\n");
  const changes = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("+") && !line.startsWith("+++")) {
      changes.push({
        type: "addition",
        line: line.substring(1),
        lineNumber: i,
      });
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      changes.push({
        type: "deletion",
        line: line.substring(1),
        lineNumber: i,
      });
    }
  }

  return changes;
}

function extractImpact(
  analysis: string
): "high" | "medium" | "low" | "unknown" {
  const lowerAnalysis = analysis.toLowerCase();
  if (lowerAnalysis.includes("high") || lowerAnalysis.includes("높음")) {
    return "high";
  } else if (
    lowerAnalysis.includes("medium") ||
    lowerAnalysis.includes("중간")
  ) {
    return "medium";
  } else if (lowerAnalysis.includes("low") || lowerAnalysis.includes("낮음")) {
    return "low";
  }
  return "unknown";
}
