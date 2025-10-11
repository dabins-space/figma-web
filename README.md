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

```
figma-web/
├── public/              # 정적 파일
├── src/
│   ├── components/      # React 컴포넌트
│   │   ├── ai-coach/   # AI 코치 관련
│   │   ├── marketing/  # 마케팅 관리
│   │   ├── news/       # 뉴스/소식
│   │   ├── reservations/ # 예약 관리
│   │   ├── store-health/ # 매장 건강지수
│   │   ├── ui/         # 재사용 UI 컴포넌트
│   │   └── widgets/    # 대시보드 위젯
│   ├── styles/         # 전역 스타일
│   ├── App.tsx         # 메인 앱 컴포넌트
│   └── main.tsx        # 앱 엔트리포인트
├── index.html          # HTML 템플릿
├── package.json        # 프로젝트 메타데이터
├── vite.config.ts      # Vite 설정
├── tailwind.config.js  # Tailwind CSS 설정
└── tsconfig.json       # TypeScript 설정
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
