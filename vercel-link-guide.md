# Vercel 프로젝트 연결 가이드

## 1단계: Vercel 대시보드 정리 완료 후

터미널에서 다음 명령 실행:

```bash
npx vercel link
```

## 2단계: 대화형 프롬프트 응답

```
? Set up "~/figma-web"? [Y/n] 
→ Y 입력

? Which scope should contain your project? 
→ 본인 계정 선택

? Link to existing project? [Y/n]
→ Y 입력

? What's the name of your existing project?
→ 대표 프로젝트 이름 입력 (예: figma-web-production)
```

성공 시 `.vercel` 폴더가 생성됩니다.

## 3단계: 배포 테스트

```bash
# 프로덕션 환경 설정 가져오기
npx vercel pull --yes --environment=production

# 빌드
npx vercel build --prod

# 배포
npx vercel deploy --prebuilt --prod
```

## 자동화 스크립트

package.json에 추가된 스크립트:

```bash
# Vercel 배포 (권장)
npm run deploy:vercel

# 단계별 실행
npm run vercel:pull
npm run vercel:build  
npm run vercel:deploy
```

## 문제 해결

### "vercel link" 실패 시
```bash
# Vercel CLI 재설치
npm install -g vercel@latest

# 로그인 확인
npx vercel login
```

### 배포 실패 시
```bash
# 로컬 빌드 먼저 확인
npm run check:build

# Vercel 로그 확인
npx vercel logs
```

