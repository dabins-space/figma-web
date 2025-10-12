// src/components/EnvWarningBanner.tsx
import { useState } from "react";

export function EnvWarningBanner() {
  const [dismissed, setDismissed] = useState(false);

  const missingEnvs: string[] = [];
  
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    missingEnvs.push("VITE_GOOGLE_CLIENT_ID");
  }
  
  // VITE_OPENAI_API_KEY는 선택사항 (Mock 데이터 사용 가능)
  // 하지만 프로덕션에서는 권장
  if (import.meta.env.PROD && !import.meta.env.VITE_OPENAI_API_KEY) {
    console.warn("⚠️ VITE_OPENAI_API_KEY not set - using mock data in production");
  }

  // 필수 환경 변수가 모두 있거나 사용자가 배너를 닫았으면 표시 안함
  if (missingEnvs.length === 0 || dismissed) {
    return null;
  }

  // 콘솔에 상세 로그
  console.error("❌ Missing required environment variables:", missingEnvs);
  console.error("📝 Please set the following in Vercel Dashboard:");
  missingEnvs.forEach(env => {
    console.error(`   - ${env}`);
  });

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        aria-label="닫기"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            ⚠️ 프로덕션 환경 변수 미설정
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p className="mb-2">다음 환경 변수가 설정되지 않았습니다:</p>
            <ul className="list-disc list-inside space-y-1">
              {missingEnvs.map(env => (
                <li key={env} className="font-mono text-xs">{env}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs">
              <strong>해결 방법:</strong> Vercel Dashboard → Settings → Environment Variables에서 설정하고 재배포하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

