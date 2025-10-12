// /api/plan.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

const SYSTEM_PROMPT = `
너는 '소상공인 요식업(카페)' 전문 마케팅 PM이다.
입력은 자유로운 한국어 한 문단일 수 있다. 누락된 정보는 상식적으로 가정하되, 가정 사항을 "assumptions"에 적어라.

반드시 다음 7단계 흐름을 한 달 타임라인에 녹여라:
1. 기본 셋업(Setup): 네이버플레이스/카카오채널/구글지도/리뷰요청 세팅
2. 메뉴 R&D: 시그니처 메뉴 개발/시식/개선
3. 콘텐츠(Content): 촬영/에디팅/게시 캘린더(주 2-3회)
4. 인플루언서/UGC(Influencer): 모집/방문/콘텐츠 게시/리포스팅
5. 유료광고(Paid): 네이버 키워드/로컬광고/리타겟팅
6. 커뮤니티(Community): 오픈채팅/쿠폰/스탬프 이벤트
7. 운영(Ops): 재고관리/현장POP/리뷰답글

일정은 ISO8601(Asia/Seoul), 평일 저녁/주말 피크를 고려해 배치.
이벤트마다 category, color, deliverables, reminders_minutes(1440, 120, 30) 포함.
일정 ID는 "ev-YYYYMMDD-<slug>-<idx>" 형태.

출력 JSON 스키마:
{
  "timeframe": { "start": "2025-MM-DD", "end": "2025-MM-DD", "timezone": "Asia/Seoul" },
  "summary": "한 줄 요약",
  "assumptions": ["가정1", "가정2"],
  "strategy_pillars": ["Setup", "R&D", "Content", "Influencer", "Paid", "Community", "Ops"],
  "events": [{
    "id": "ev-20250101-setup-1",
    "title": "작업명",
    "description": "상세설명",
    "start": "2025-01-01T10:00:00+09:00",
    "end": "2025-01-01T12:00:00+09:00",
    "all_day": false,
    "color": "#3B82F6",
    "category": "Setup",
    "channel": "Naver Place",
    "deliverables": ["체크리스트"],
    "attendees": [],
    "reminders_minutes": [1440, 120],
    "depends_on": []
  }]
}
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 헤더 추가 (필요시)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { brief } = req.body || {};
  if (!brief) {
    return res.status(400).json({ error: "Missing brief" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  console.log("[/api/plan] Request received:", { brief: brief.substring(0, 100) + '...' });
  
  try {
    // 타임아웃 설정 (50초, Vercel 제한 60초보다 작게)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000);

    try {
      // OpenAI Chat Completions API (올바른 엔드포인트)
      const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // 더 빠르고 저렴한 모델
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `브리프:\n${brief}` },
          ],
          response_format: { type: "json_object" }, // JSON 모드
          temperature: 0.2,
          max_tokens: 2000,
        }),
      });

      clearTimeout(timeoutId);

      if (!apiRes.ok) {
        const errorText = await apiRes.text();
        console.error("[/api/plan] OpenAI API error:", apiRes.status, errorText);
        return res.status(apiRes.status).json({ 
          error: "OpenAI API 호출 실패", 
          details: errorText,
          hint: "Vercel Dashboard에서 OPENAI_API_KEY 환경 변수를 확인하세요."
        });
      }

      const data = await apiRes.json();
      const text = data?.choices?.[0]?.message?.content ?? "";

      if (!text) {
        console.error("[/api/plan] Empty response from OpenAI");
        return res.status(500).json({ 
          error: "OpenAI로부터 빈 응답을 받았습니다.",
          hint: "API 키가 유효한지 확인하세요."
        });
      }

      console.log("[/api/plan] Parsing OpenAI response...");
      const plan = JSON.parse(text);
      console.log("[/api/plan] Success - generated", plan.events?.length, "events");
      return res.status(200).json(plan);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error("[/api/plan] Request timeout (50s)");
        return res.status(504).json({ 
          error: "요청 시간 초과 (50초)",
          hint: "간단한 브리프로 다시 시도해보세요."
        });
      }
      throw fetchError;
    }
  } catch (e: any) {
    console.error("[/api/plan] Handler error:", e.message, e.stack);
    return res.status(500).json({ 
      error: e?.message || "서버 내부 오류",
      type: e?.name || "UnknownError",
      hint: "Vercel 함수 로그를 확인하세요."
    });
  }
}

