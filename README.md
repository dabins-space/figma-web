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

### 환경 변수 설정
`.env` 파일을 생성하고 필요한 환경 변수를 설정하세요:

```bash
# .env 파일 생성 (템플릿 복사)
cp .env.example .env
```

`.env` 파일 예시:
```env
# OpenAI API Key (서버용 - Vercel 배포 시 필요)
OPENAI_API_KEY=your_openai_api_key_here

# OpenAI API Key (클라이언트용 - 로컬 개발 시 필요)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Google Client ID (필수 - 구글 캘린더 연동용)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# API 엔드포인트 (선택)
VITE_API_BASE_URL=http://localhost:3000
```

⚠️ **중요**: 
- `.env` 파일은 Git에 커밋하지 마세요!
- `VITE_OPENAI_API_KEY`가 없으면 개발 중 Mock 데이터가 사용됩니다
- `VITE_OPENAI_API_KEY`를 설정하면 실제 OpenAI API가 호출됩니다 (비용 발생)

### Google Calendar API 설정 방법

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스 > 라이브러리**로 이동
4. "Google Calendar API" 검색 후 사용 설정
5. **API 및 서비스 > 사용자 인증 정보**로 이동
6. **사용자 인증 정보 만들기 > OAuth 클라이언트 ID** 선택
7. 애플리케이션 유형: **웹 애플리케이션**
8. 승인된 JavaScript 원본: `http://localhost:5173`, `https://your-domain.com`
9. 생성된 **클라이언트 ID**를 `.env` 파일의 `VITE_GOOGLE_CLIENT_ID`에 입력

### 개발 서버 실행

**일반 개발 (권장)**:
```bash
npm run dev
```
로컬 서버: http://localhost:5173/

> 💡 **개발 모드 작동 방식**:
> - `VITE_OPENAI_API_KEY`가 **있으면**: 실제 OpenAI API 호출 (비용 발생 ⚠️)
> - `VITE_OPENAI_API_KEY`가 **없으면**: Mock 데이터 사용 (무료 🎭)

**Vercel 서버리스 함수 테스트** (선택):
```bash
npm run dev:vercel
```
Vercel 로컬 서버: http://localhost:3000/

> 프로덕션 환경과 동일하게 `/api/plan` 엔드포인트를 테스트할 수 있습니다.

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
├── api/                   # Vercel 서버리스 함수
│   └── plan.ts           # AI 마케팅 플랜 생성 API
├── public/                # 정적 파일
├── src/
│   ├── app/              # 앱 엔트리 & 레이아웃
│   │   ├── layout/       # Header, Sidebar 등
│   │   ├── App.tsx       # 메인 앱
│   │   └── routes.tsx    # 라우트 설정
│   ├── features/         # 기능별 모듈 (Feature-First)
│   │   ├── auth/         # 인증 (로그인)
│   │   ├── dashboard/    # 대시보드 & 위젯
│   │   ├── ai-coach/     # AI 코치
│   │   ├── marketing/    # 마케팅 관리
│   │   ├── news/         # 뉴스/소식
│   │   ├── reservations/ # 예약 관리
│   │   ├── store-health/ # 매장 건강지수
│   │   └── settings/     # 설정
│   ├── api/              # API 클라이언트 함수
│   │   ├── plan.ts       # 마케팅 플랜 API 클라이언트
│   │   └── index.ts      # API 통합 export
│   ├── components/       # 공유 UI 컴포넌트
│   │   └── ui/          # Radix UI 래퍼 (41개)
│   ├── hooks/           # 커스텀 훅
│   ├── lib/             # 유틸리티 함수
│   ├── types/           # 타입 정의
│   ├── styles/          # 전역 스타일
│   ├── assets/          # 정적 자산
│   └── main.tsx         # 앱 엔트리포인트
├── .env                 # 환경 변수 (Git 제외)
├── .env.example         # 환경 변수 템플릿
├── index.html           # HTML 템플릿
├── package.json         # 프로젝트 메타데이터
├── vite.config.ts       # Vite 설정 (@ alias)
├── tailwind.config.js   # Tailwind CSS 설정
├── vercel.json          # Vercel 배포 설정
└── tsconfig.json        # TypeScript 설정 (@ alias)
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
- **Calendar**: FullCalendar
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel

## 📝 주요 기능

- 📊 대시보드 - 매장 현황 한눈에 보기
- 🏥 매장 건강지수 - AI 기반 매장 분석
- 📅 예약 관리 - 예약 현황 및 트렌드 분석
- 📣 마케팅 관리 - 광고, SNS, 리뷰 통합 관리
- 🤖 AI 잘코치 - AI 기반 마케팅 컨설팅
- 📰 알뜰소식 - 업계 뉴스 및 정보
- ⚙️ 설정 - 매장 정보 및 연동 관리

## 🤖 AI 마케팅 플랜 API

OpenAI를 활용한 자동 마케팅 스케줄 생성 기능:

### 사용 방법

```typescript
import { createMarketingPlan } from '@/api';

// 마케팅 브리프 작성
const brief = `
  목표: 신메뉴 출시 홍보 및 매출 20% 증가
  기간: 2주 (2025-03-01 ~ 2025-03-15)
  제약: 예산 50만원, 직원 2명
  채널: 인스타그램, 네이버 블로그, 카카오톡 채널
`;

// AI가 자동으로 마케팅 스케줄 생성
const plan = await createMarketingPlan(brief);

console.log(plan.plan_title);
plan.events.forEach(event => {
  console.log(`${event.title}: ${event.start} ~ ${event.end}`);
});
```

### API 엔드포인트

- **POST** `/api/plan`
  - Request: `{ brief: string }`
  - Response: `{ plan_title: string, events: Event[] }`

### 응답 예시

```json
{
  "plan_title": "신메뉴 출시 마케팅 플랜",
  "events": [
    {
      "title": "신메뉴 콘셉트 기획",
      "description": "메뉴 사진 촬영 및 카피 작성",
      "start": "2025-03-01T10:00:00+09:00",
      "end": "2025-03-01T12:00:00+09:00",
      "all_day": false,
      "color": "#3B82F6",
      "attendees": [],
      "reminders_minutes": [1440, 60],
      "labels": ["기획"]
    }
  ]
}
```

## 🌐 배포

### Vercel 배포 가이드

#### 1. 프로젝트 설정

Vercel 대시보드에서 다음 설정을 사용하세요:

| 설정 | 값 |
|------|-----|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm ci` (권장) 또는 `npm install` |
| **Node.js Version** | 18.x 이상 권장 |

#### 2. 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables에서 설정:

**필수 환경 변수:**
- `OPENAI_API_KEY`: OpenAI API 키 (서버리스 함수용)
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth 클라이언트 ID

**선택 환경 변수:**
- `VITE_OPENAI_API_KEY`: 클라이언트 사이드 OpenAI 호출용 (개발 모드)
- `VITE_API_BASE_URL`: API 베이스 URL (기본값: 자동 감지)

#### 3. 배포 확인

```bash
# 로컬에서 빌드 테스트
npm run check:build

# Vercel CLI로 로컬 테스트 (선택사항)
npm run dev:vercel
```

#### 4. 배포 방법

**방법 1: 자동 배포 (권장)**
- GitHub `main` 브랜치에 푸시하면 자동으로 배포됩니다
- Preview: 다른 브랜치에 푸시

**방법 2: 수동 배포 (Vercel CLI)**

먼저 프로젝트 연결 (최초 1회만):
```bash
npx vercel link
# → Link to existing project 선택
# → 대표 프로젝트 선택
```

배포 실행:
```bash
# 한 번에 배포
npm run deploy:vercel

# 또는 단계별로
npm run vercel:pull    # 환경 변수 가져오기
npm run vercel:build   # Vercel 빌드
npm run vercel:deploy  # 배포
```

#### 5. 문제 해결

**빌드 실패 시:**

1. **의존성 문제**
   ```bash
   # 로컬에서 clean install 테스트
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Node.js 버전 문제**
   - Vercel 프로젝트 설정에서 Node.js 18.x 이상 사용 확인

3. **환경 변수 누락**
   - Vercel 대시보드에서 필수 환경 변수 확인
   - Production과 Preview 환경 모두 설정 필요

4. **빌드 로그 확인**
   - Vercel 대시보드 → Deployments → [실패한 배포] → Build Logs

**서버리스 함수 문제:**
- `api/` 디렉토리의 파일이 자동으로 서버리스 함수로 변환됨
- `@vercel/node`가 devDependencies에 있는지 확인

**캐시 문제:**
- Vercel 대시보드에서 "Redeploy" 클릭 시 "Clear cache" 옵션 선택

GitHub: https://github.com/dabins-space/figma-web
Production: (Vercel URL)

## 🐛 문제 해결

### "스케줄 생성(GPT)" 버튼을 눌렀을 때 에러 발생

**원인**: 로컬 개발 환경에서 Vercel 서버리스 함수가 작동하지 않음

**해결방법**:

1. **Mock 데이터 사용 (권장)**:
   ```bash
   # .env 파일에서 VITE_OPENAI_API_KEY를 제거하거나 비워두기
   npm run dev
   ```
   → 테스트용 샘플 데이터가 표시됩니다

2. **실제 OpenAI API 호출**:
   ```bash
   # .env 파일에 OpenAI API 키 설정
   VITE_OPENAI_API_KEY=sk-...your_key...
   npm run dev
   ```
   → 실제 AI 스케줄이 생성됩니다 (비용 발생)

3. **Vercel Dev 사용**:
   ```bash
   npm run dev:vercel
   ```
   → 프로덕션 환경과 동일하게 테스트

### FullCalendar CSS 에러

**해결됨**: CDN을 통해 CSS 로드하도록 수정됨 (index.html)

### Google Calendar 연동 에러

`VITE_GOOGLE_CLIENT_ID`가 `.env`에 설정되어 있는지 확인하세요.

## 📄 라이선스

Private Project
