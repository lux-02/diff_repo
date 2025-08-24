# GitHub Diff Analyzer 🔍

AI 기반 GitHub 커밋 변경사항 분석 도구입니다. Google Gemini AI를 활용하여 커밋의 diff를 자동으로 분석하고 시각화합니다.

## 🌟 주요 기능

- **GitHub 커밋 분석**: 공개 GitHub 레포지토리의 커밋 URL을 입력하면 자동으로 변경사항을 가져옵니다
- **AI 기반 코드 분석**: Google Gemini AI가 변경사항의 목적, 영향도, 개선사항을 한국어로 분석합니다
- **시각적 Diff 뷰어**: 파일별 변경사항을 직관적으로 확인할 수 있습니다
- **상세한 통계**: 추가/삭제된 라인 수, 변경된 파일 수 등의 통계를 제공합니다
- **반응형 디자인**: 모바일과 데스크톱에서 모두 최적화된 UI를 제공합니다

## 🚀 시작하기

### 필요 사항

- Node.js 18.0 이상
- Google Gemini API 키

### 설치 및 실행

1. 저장소 클론

```bash
git clone https://github.com/your-username/github-diff-analyzer.git
cd github-diff-analyzer
```

2. 의존성 설치

```bash
npm install
```

3. 환경변수 설정
   `.env.local` 파일을 생성하고 Google Gemini API 키를 설정합니다:

```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. 개발 서버 실행

```bash
npm run dev
```

5. 브라우저에서 `http://localhost:3000` 접속

## 📖 사용 방법

1. **GitHub 커밋 URL 입력**: 분석하고 싶은 공개 GitHub 커밋의 URL을 입력합니다

   - 예시: `https://github.com/owner/repo/commit/sha`

2. **분석 시작**: "분석 시작" 버튼을 클릭합니다

3. **결과 확인**:
   - 커밋 정보 (작성자, 날짜, 메시지 등)
   - 파일별 diff 시각화
   - AI 기반 변경사항 분석 결과

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React (아이콘)
- **AI**: Google Gemini Pro API
- **API**: GitHub REST API

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── github/commit/     # GitHub API 통합
│   │   └── analyze/           # Gemini AI 분석
│   ├── globals.css           # 글로벌 스타일
│   ├── layout.tsx           # 레이아웃 컴포넌트
│   └── page.tsx             # 메인 페이지
└── components/
    ├── CommitInfo.tsx       # 커밋 정보 표시
    ├── DiffViewer.tsx       # Diff 시각화
    └── AnalysisPanel.tsx    # AI 분석 결과
```

## 🎯 주요 특징

### GitHub API 통합

- 공개 레포지토리의 커밋 정보를 실시간으로 가져옵니다
- 파일별 변경사항과 diff 정보를 상세히 제공합니다

### AI 분석

- Google Gemini Pro를 사용한 고품질 코드 분석
- 변경사항의 목적과 의도 파악
- 영향도 평가 (High/Medium/Low)
- 개선사항 및 주의사항 제안

### 사용자 경험

- 직관적이고 깔끔한 UI
- 실시간 로딩 상태 표시
- 오류 처리 및 사용자 피드백
- 모바일 친화적 반응형 디자인

## 🔧 API 엔드포인트

### GET `/api/github/commit`

GitHub 커밋 정보를 가져옵니다.

**파라미터:**

- `url`: GitHub 커밋 URL

**응답:**

```json
{
  "commit": { ... },
  "repository": { ... },
  "stats": { ... },
  "files": [ ... ]
}
```

### POST `/api/analyze`

커밋 변경사항을 AI로 분석합니다.

**요청 본문:**

```json
{
  "files": [...],
  "commitMessage": "..."
}
```

**응답:**

```json
{
  "analyses": [
    {
      "filename": "...",
      "analysis": "...",
      "impact": "high|medium|low",
      ...
    }
  ]
}
```

## 🌐 예시 URL

테스트를 위한 예시 GitHub 커밋 URL:

- `https://github.com/lux-02/qshing_pj/commit/ff81a4956f423aee82d6f15a34e59efad55de59c`

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📧 문의

질문이나 제안사항이 있으시면 이슈를 생성해주세요.

---

**Powered by Google Gemini AI & GitHub API** 🚀
