# 잘나가게 - AI 마케팅 플랫폼

소상공인을 위한 AI 기반 마케팅 관리 플랫폼

## 🚀 빠른 시작

### 개발 환경 요구사항
- Node.js >= 18
- npm 또는 pnpm

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```
로컬 서버: http://localhost:5173/

### 프로덕션 빌드
```bash
npm run build
```

### 빌드 결과 미리보기
```bash
npm run preview
```

## 📁 프로젝트 구조

Feature-First 아키텍처를 따릅니다:

```
figma-web/
├── public/                 # 정적 파일
├── src/
│   ├── app/               # 앱 엔트리 & 레이아웃
│   │   ├── layout/        # Header, Sidebar 등
│   │   ├── App.tsx        # 메인 앱
│   │   └── routes.tsx     # 라우트 설정
│   ├── features/          # 기능별 모듈 (Feature-First)
│   │   ├── auth/          # 인증 (로그인)
│   │   ├── dashboard/     # 대시보드 & 위젯
│   │   ├── ai-coach/      # AI 코치
│   │   ├── marketing/     # 마케팅 관리
│   │   ├── news/          # 뉴스/소식
│   │   ├── reservations/  # 예약 관리
│   │   ├── store-health/  # 매장 건강지수
│   │   └── settings/      # 설정
│   ├── components/        # 공유 UI 컴포넌트
│   │   └── ui/           # Radix UI 래퍼 (41개)
│   ├── hooks/            # 커스텀 훅
│   ├── lib/              # 유틸리티 함수
│   ├── types/            # 타입 정의
│   ├── styles/           # 전역 스타일
│   ├── assets/           # 정적 자산
│   └── main.tsx          # 앱 엔트리포인트
├── index.html            # HTML 템플릿
├── package.json          # 프로젝트 메타데이터
├── vite.config.ts        # Vite 설정 (@ alias)
├── tailwind.config.js    # Tailwind CSS 설정
└── tsconfig.json         # TypeScript 설정 (@ alias)
```

### Import Path Aliases

`@` 별칭을 사용하여 깔끔한 import:

```typescript
// ✅ Good
import { Button } from "@/components/ui/button";
import { Dashboard } from "@/features/dashboard";
import { cn } from "@/lib/utils";

// ❌ Avoid
import { Button } from "../../../components/ui/button";
```

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Deployment**: Vercel

## 📝 주요 기능

- 📊 대시보드 - 매장 현황 한눈에 보기
- 🏥 매장 건강지수 - AI 기반 매장 분석
- 📅 예약 관리 - 예약 현황 및 트렌드 분석
- 📣 마케팅 관리 - 광고, SNS, 리뷰 통합 관리
- 🤖 AI 잘코치 - AI 기반 마케팅 컨설팅
- 📰 알뜰소식 - 업계 뉴스 및 정보
- ⚙️ 설정 - 매장 정보 및 연동 관리

## 🌐 배포

GitHub: https://github.com/dabins-space/figma-web
Production: (Vercel URL)

## 📄 라이선스

Private Project
