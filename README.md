# 🥐 Morning Bakery

> 모닝베이커리 브랜드 홈페이지 — 메뉴 소개, SNS 피드 자동 연동, 매장 안내

## 🌐 URL

| | URL |
|--|--|
| 프론트엔드 | https://morningbakery.co.kr |
| 백엔드 API | https://morningbakery-api-6391c51d5a00.herokuapp.com/api |
| 어드민 | https://morningbakery.co.kr/admin |

---

## 🏗️ 스택

| 구분 | 기술 |
|--|--|
| 프론트엔드 | React + Vite → Vercel |
| 백엔드 | Node.js + Express → Heroku (Eco Dyno) |
| DB | MongoDB Atlas |
| SNS | Instagram / YouTube / Threads / Naver Blog |

---

## 🧭 네비게이션

| 메뉴 | 대상 |
|--|--|
| HOME | `#home` |
| MENU | `#about` |
| SNS ▾ | `#sns` (드롭다운: instagram / youtube / naverblog / threads) |
| VISIT | `#visit` — 구글지도·운영시간·주차·공지 |
| CONTACT | `#contact` — 전화·카카오채널·이메일 |

---

## 📁 파일 구조

### 백엔드 `/backend`

| 파일 | 역할 |
|--|--|
| `server.js` | 진입점, 라우트 등록, `initSnsPrefetch()` 호출 |
| `models/SiteContent.js` | 히어로·어바웃·SNS·설정·태그라인 싱글톤 스키마 |
| `models/SnsCache.js` | SNS 피드 MongoDB 캐시 (Dyno 재기동 복원) |
| `models/MenuItem.js` | 메뉴 아이템 |
| `routes/auth.js` | 로그인 / JWT 발급 |
| `routes/content.js` | 콘텐츠 조회·수정, SNS CRUD, 설정, 태그라인 |
| `routes/instagram.js` | Instagram Graph API 프록시 |
| `routes/youtube.js` | YouTube Data API v3 / RSS 폴백 |
| `routes/threads.js` | Threads API 프록시 |
| `routes/naverblog.js` | 네이버 블로그 RSS + 이미지 프록시 |
| `lib/sns-fetchers.js` | 4개 플랫폼 순수 fetch 함수 |
| `lib/sns-prefetch.js` | 인메모리 + DB 캐시 관리자 + 15분 cron |
| `lib/xml-parser.js` | XML 파싱 유틸 |
| `scripts/createAdmin.js` | 어드민 계정 초기 생성 |

### 프론트엔드 `/frontend/src`

| 파일 | 역할 |
|--|--|
| `App.jsx` | 라우팅 (홈 / 어드민 로그인 / 어드민 대시보드) |
| `api.js` | Axios 인스턴스 + JWT 인터셉터 |
| `components/Header.jsx` | 네비게이션 (HOME · MENU · SNS · VISIT · CONTACT) |
| `components/Footer.jsx` | 하단 정보 (주소·연락처·사이트맵) |
| `components/Hero.jsx` | 히어로 섹션, SNS 아이콘 (클릭 시 해당 섹션으로 스크롤) |
| `components/About.jsx` | MENU 섹션 — 시그니처·인기·신메뉴 카드 |
| `components/SnsCarousel.jsx` | SNS 피드 오케스트레이터 |
| `components/VisitSection.jsx` | VISIT 섹션 — 구글지도·위치·운영시간·주차·공지 |
| `components/ContactSection.jsx` | CONTACT 섹션 — 전화·카카오채널·이메일 |
| `components/sns/InstagramSection.jsx` | IG 카드 컨베이어 (`id="sns-instagram"`) |
| `components/sns/YoutubeSection.jsx` | YT 카드 크로스페이드 (`id="sns-youtube"`) |
| `components/sns/NaverBlogSection.jsx` | 블로그 카드 컨베이어 (`id="sns-naverblog"`) |
| `components/sns/ThreadsSection.jsx` | 스레드 카드 크로스페이드 (`id="sns-threads"`) |
| `hooks/useConveyorBelt.js` | 컨베이어 RAF 스크롤 훅 (인스타·블로그 공유) |
| `admin/AdminDashboard.jsx` | 어드민 대시보드 |
| `admin/SnsManager.jsx` | SNS 관리 — 태그라인·유튜브 채널ID·API키 설정 |

---

## 🔄 SNS 캐시 구조

```
요청 → 인메모리 hit → 즉시 응답
     → miss → 외부 API 호출 → 인메모리 + MongoDB 저장

Dyno 기동 시: MongoDB → 인메모리 복원(~50ms) → 만료 캐시만 비동기 갱신
15분마다: cron으로 전체 플랫폼 재조회
```

> **Keep-alive 권장**: UptimeRobot 등으로 `/api/health` 20분 간격 ping (Eco Dyno sleep 방지)

---

## 🔗 SNS 연동

| SNS | 방식 | 설정 |
|--|--|--|
| Instagram | Graph API | Heroku 환경변수 `INSTAGRAM_ACCESS_TOKEN` (60일마다 갱신) |
| YouTube | Data API v3 → RSS 폴백 | 어드민 페이지에서 채널ID·API키 직접 입력 |
| Threads | Graph API | Heroku 환경변수 `THREADS_ACCESS_TOKEN` (60일마다 갱신) |
| Naver Blog | RSS 파싱 + 이미지 프록시 | 환경변수 `NAVER_BLOG_ID` |

---

## ⚙️ 환경 변수

### 백엔드 (`backend/.env` / Heroku Config Vars)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
PORT=8000
FRONTEND_URL=https://morningbakery.co.kr
INSTAGRAM_ACCESS_TOKEN=...
THREADS_ACCESS_TOKEN=...
NAVER_BLOG_ID=morningbakery
YOUTUBE_CHANNEL_ID=UCn8qYoiJBSbzKj6KBBv136Q   # DB 설정값 없을 때 폴백
YOUTUBE_API_KEY=...                              # DB 설정값 없을 때 폴백
```

### 프론트엔드 (`frontend/.env`)
```env
VITE_API_URL=https://morningbakery-api-6391c51d5a00.herokuapp.com/api
```

---

## 🚀 배포

### 백엔드 (Heroku)
```bash
cd backend && git push heroku main
```

### 프론트엔드 (Vercel — GitHub 연동 자동 배포)
```bash
git add -A && git commit -m "..." && git push origin main
# 또는 수동: cd frontend && npx vercel --prod  (루트 폴더에서 실행)
```

### Heroku 환경 변수 설정
```bash
heroku config:set KEY=VALUE --app morningbakery-api
```

---

## 👤 어드민

- URL: `https://morningbakery.co.kr/admin`
- 계정: `backend/.env` → `ADMIN_EMAIL` / `ADMIN_PASSWORD`

---

## 📋 TODO

| 우선순위 | 항목 |
|--|--|
| 🔴 긴급 | Instagram · Threads 토큰 만료 전 갱신 (60일 주기) |
| 🟡 중요 | Meta 앱 검수 제출 (현재 개발 모드) |
| 🟡 중요 | Keep-alive 설정 — UptimeRobot으로 `/api/health` 20분 ping |
| 🟡 중요 | 토큰 만료 D-7 어드민 경고 알림 |
| 🟢 개선 | OG 이미지, sitemap.xml, robots.txt |
