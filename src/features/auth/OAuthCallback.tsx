// src/features/auth/OAuthCallback.tsx
import { useEffect, useState } from "react";

export default function OAuthCallback() {
  // useNavigate 대신 window.location 사용 (React Router 없음)
  const navigate = (path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.location.replace(path);
    } else {
      window.location.href = path;
    }
  };
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // URL에서 OAuth 파라미터 파싱
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    console.log("OAuth Callback received:", { code: !!code, state, error });

    // 에러 처리
    if (error) {
      const errorMsg = errorDescription || error || "로그인 실패";
      console.error("OAuth Error:", error, errorDescription);
      setStatus("error");
      setMessage(errorMsg);
      
      // 3초 후 홈으로 리다이렉트
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
      return;
    }

    // 성공 처리
    if (code) {
      console.log("OAuth Success - Authorization code received");
      setStatus("success");
      setMessage("로그인 성공! 대시보드로 이동합니다...");

      // TODO: 백엔드에 code를 전송하여 토큰 교환 (필요시)
      // await fetch('/api/auth/token', { method: 'POST', body: JSON.stringify({ code }) });

      // 2초 후 대시보드로 이동
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
      return;
    }

    // code도 error도 없으면 잘못된 접근
    console.warn("Invalid OAuth callback - no code or error");
    setStatus("error");
    setMessage("잘못된 접근입니다.");
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 2000);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        {status === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">로그인 처리 중...</h2>
            <p className="text-gray-600">잠시만 기다려주세요.</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-green-600">✅ {message}</h2>
            <p className="text-gray-600">자동으로 이동합니다...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-600">⚠️ 로그인 실패</h2>
            <p className="text-gray-700 mb-4">{message}</p>
            <p className="text-sm text-gray-500">홈으로 돌아갑니다...</p>
          </div>
        )}
      </div>
    </div>
  );
}

