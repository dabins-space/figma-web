// /api/plan.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

const SYSTEM_PROMPT = `
너는 소상공인(요식업)을 위한 마케팅 매니저다.
사용자의 목표/기간/제약/채널을 바탕으로 '기획→제작→발행→리뷰' 단계의 홍보 스케줄을 만든다.
아래 JSON 스키마로만 출력해. 모든 날짜는 +09:00 ISO8601 형식.
{
  "plan_title": "string",
  "events": [
    {
      "title": "string",
      "description": "string",
      "start": "YYYY-MM-DDTHH:MM:SS+09:00",
      "end": "YYYY-MM-DDTHH:MM:SS+09:00",
      "all_day": boolean,
      "color": "string",
      "attendees": ["email"],
      "reminders_minutes": [number],
      "labels": ["string"]
    }
  ]
}
규칙: 이벤트 5~10개, 제작은 발행 2~4일 전, 겹침 최소화, 출력은 JSON만.
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

  try {
    // OpenAI Chat Completions API (올바른 엔드포인트)
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview", // 또는 gpt-4, gpt-4o 등
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `브리프:\n${brief}` },
        ],
        response_format: { type: "json_object" }, // JSON 모드
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error("OpenAI API error:", errorText);
      return res.status(apiRes.status).json({ 
        error: "OpenAI API error", 
        details: errorText 
      });
    }

    const data = await apiRes.json();
    const text = data?.choices?.[0]?.message?.content ?? "";

    if (!text) {
      return res.status(500).json({ error: "Empty response from OpenAI" });
    }

    const plan = JSON.parse(text);
    return res.status(200).json(plan);
  } catch (e: any) {
    console.error("Handler error:", e);
    return res.status(500).json({ 
      error: e?.message || "Internal server error",
      stack: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    });
  }
}

