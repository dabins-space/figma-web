# AI 마케팅 액션 플랜 자동 생성 및 Google Calendar 연동

## 기능 개요

AI와의 대화를 기반으로 마케팅 액션 플랜을 자동 생성하고, Google Calendar에 자동으로 등록하는 기능입니다.

## 주요 기능

1. **AI 채팅 인터페이스**: 마케팅 관련 질문을 통해 실시간 대화
2. **액션 플랜 자동 생성**: 대화 내용을 분석하여 구체적인 마케팅 액션 플랜 생성
3. **Google Calendar 연동**: 생성된 액션 플랜을 Google Calendar 이벤트로 자동 등록
4. **우선순위 관리**: P0(긴급), P1(중요), P2(일반) 우선순위 시스템
5. **중복 방지**: 이미 등록된 이벤트는 자동으로 스킵
6. **실시간 미리보기**: 생성된 액션 플랜을 캘린더에서 미리 확인

## 환경 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# OpenAI API 설정 (실제 GPT API 사용을 위해 필수)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Google OAuth 설정
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**중요**: `VITE_OPENAI_API_KEY`가 설정되어 있으면 실제 GPT API를 호출하여 대화 내용을 분석합니다. 설정하지 않으면 Mock 데이터가 사용됩니다.

### 2. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스 > 라이브러리**에서 다음 API 활성화:
   - Google Calendar API
   - Google Identity Services API
4. **API 및 서비스 > 사용자 인증 정보**에서 OAuth 2.0 클라이언트 ID 생성
5. 승인된 JavaScript 원본에 `http://localhost:5173` (개발) 및 프로덕션 도메인 추가
6. 승인된 리디렉션 URI에 `http://localhost:5173` 추가

### 3. OpenAI API 키 발급

1. [OpenAI Platform](https://platform.openai.com/)에 접속
2. 계정 생성 및 로그인
3. **API Keys** 섹션에서 새 API 키 생성
4. 생성된 키를 `.env.local` 파일에 설정

## 사용 방법

### 1. 개발 서버 실행

```bash
npm install
npm run dev
```

### 2. AI 채팅으로 액션 플랜 생성

1. 스케줄 페이지의 AI 채팅 사이드바에서 마케팅 관련 질문 입력
2. **실제 GPT API 사용**: `VITE_OPENAI_API_KEY`가 설정되어 있으면 실제 GPT가 대화 내용을 분석
3. **Mock 데이터 사용**: API 키가 없으면 미리 정의된 샘플 데이터 사용
4. 예시 질문들:
   - "이번주 마케팅 전략 수립해줘"
   - "신규 고객 유치 방안 알려줘"
   - "SNS 마케팅 콘텐츠 기획"
   - "이벤트 홍보 전략 만들어줘"
   - "카페 신메뉴 홍보를 위한 마케팅 계획 세워줘"
5. AI가 대화 내용을 분석하여 개인화된 구체적인 액션 플랜 생성

### 3. Google Calendar 연동

1. **Google 로그인** 버튼 클릭하여 Google 계정으로 인증
2. 액션 플랜이 생성되면 **Google Calendar에 등록** 버튼 클릭
3. 생성된 액션 아이템들이 Google Calendar에 자동으로 등록됨

## 데이터 구조

### ActionPlan
```typescript
{
  plan_title: string,
  items: ActionItem[]
}
```

### ActionItem
```typescript
{
  id: string,
  title: string,
  description?: string,
  start?: string,   // ISO 8601 (예: 2024-01-15T10:00:00+09:00)
  end?: string,
  all_day?: boolean,
  priority?: "P0" | "P1" | "P2",
  channel?: string, // 예: SNS, EDM, Blog 등
  reminders?: { minutes_before: number }[],
  notes?: string
}
```

## 이벤트 매핑 규칙

- **타임존**: Asia/Seoul (+09:00) 고정
- **기본 시간**: start/end 없을 시 다음 영업일 10:00-11:00
- **종일 이벤트**: all_day=true일 때 종일 이벤트로 처리
- **우선순위별 색상**:
  - P0 (긴급): 빨간색
  - P1 (중요): 주황색  
  - P2 (일반): 파란색
- **알림**: reminders 없으면 기본 30분 전 팝업 알림
- **중복 방지**: `extendedProperties.private.clientRequestId`에 ActionItem.id 저장

## API 엔드포인트

### POST /api/action-plan/generate
AI 액션 플랜 생성

**요청 본문:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "마케팅 전략 수립해줘"
    }
  ],
  "user_context": {
    "business_type": "카페"
  }
}
```

### POST /api/action-plan/register-calendar
Google Calendar에 액션 플랜 등록

**헤더:**
```
Authorization: Bearer {access_token}
```

**요청 본문:**
```json
{
  "plan_title": "마케팅 액션 플랜",
  "items": [...]
}
```

## 트러블슈팅

### 1. OpenAI API 오류
- API 키가 올바르게 설정되었는지 확인
- OpenAI 계정에 충분한 크레딧이 있는지 확인
- 개발 환경에서는 Mock 데이터가 반환됩니다

### 2. Google OAuth 오류
- Google Cloud Console에서 클라이언트 ID가 올바르게 설정되었는지 확인
- 승인된 도메인이 올바르게 설정되었는지 확인
- 브라우저에서 쿠키와 팝업 차단을 허용했는지 확인

### 3. 캘린더 등록 실패
- Google Calendar API가 활성화되었는지 확인
- 사용자 계정에 캘린더 쓰기 권한이 있는지 확인
- 네트워크 연결 상태 확인

## 파일 구조

```
src/
├── types/
│   └── actionPlan.ts              # 타입 정의
├── api/
│   ├── actionPlan.ts              # API 클라이언트
│   └── action-plan/
│       ├── generate.ts            # 액션 플랜 생성 API
│       ├── register-calendar.ts   # 캘린더 등록 API
│       └── route.ts               # API 라우트 인덱스
└── features/marketing-health/
    ├── components/
    │   └── AIChatSidebar.tsx      # AI 채팅 컴포넌트
    └── pages/
        └── schedule.tsx           # 스케줄 페이지
```

## 라이센스

MIT License
