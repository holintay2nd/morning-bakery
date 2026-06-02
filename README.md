# 🥐 Morning Bakery

> 모닝베이커리 브랜드 홈페이지 — Brand Hub 개념 적용: 고객의 방문 결정을 돕는 온라인 공간

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
| GUIDE | `#recommend` — 방문 목적별 추천 |
| SNS ▾ | `#sns` (드롭다운: instagram / youtube / naverblog / threads) |
| VISIT | `#visit` — 구글지도·운영시간·주차·공지·이용 가이드 |
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
| `index.css` | Tailwind + 커스텀 유틸 (mobile-snap-container 등) |
| `components/Header.jsx` | 네비게이션 (HOME · MENU · GUIDE · SNS · VISIT · CONTACT) |
| `components/Footer.jsx` | 하단 정보 (주소·연락처·사이트맵) — 데스크탑 전용 |
| `components/Hero.jsx` | 히어로 섹션, CTA (카페 안내 / 이럴 때 추천해요) |
| `components/About.jsx` | MENU 섹션 — 시그니처·인기·신메뉴 카드 |
| `components/RecommendSection.jsx` | GUIDE 섹션 — 방문 목적별 맞춤 추천 카드 (5종) |
| `components/SnsCarousel.jsx` | SNS 피드 오케스트레이터 (모바일: 플랫폼별 독립 스냅 섹션) |
| `components/VisitSection.jsx` | VISIT 섹션 — 구글지도·위치·운영시간·주차·이용 가이드 |
| `components/ContactSection.jsx` | CONTACT 섹션 — 전화·카카오채널·이메일 |
| `components/sns/InstagramSection.jsx` | IG 카드 컨베이어 (데스크탑) / 페이드 슬라이더 (모바일) |
| `components/sns/YoutubeSection.jsx` | YT 크로스페이드 (데스크탑) / 페이드 슬라이더 (모바일) |
| `components/sns/NaverBlogSection.jsx` | 블로그 카드 컨베이어 (데스크탑) / 페이드 슬라이더 (모바일) |
| `components/sns/ThreadsSection.jsx` | 스레드 크로스페이드 (데스크탑) / 페이드 슬라이더 (모바일) |
| `components/sns/MobileCardSlider.jsx` | 모바일 전용 페이드 슬라이더 (화살표 + 인디케이터) |
| `components/sns/ConveyorWrap.jsx` | 컨베이어 래퍼 (오버레이 화살표 포함) |
| `hooks/useConveyorBelt.js` | 컨베이어 RAF 스크롤 훅 |
| `admin/AdminDashboard.jsx` | 어드민 대시보드 |
| `admin/SnsManager.jsx` | SNS 관리 — 태그라인·유튜브 채널ID·API키 설정 |

---

## 📱 모바일 UX

### 전체화면 섹션 스냅

모바일(< 768px)에서는 `scroll-snap-type: y mandatory` 기반의 전체화면 스냅 스크롤 적용.

```
HOME → MENU → GUIDE → Instagram → YouTube → NaverBlog → Threads → VISIT → CONTACT
```

- 각 섹션이 `100svh` 전체화면을 채우며 스와이프로 전환
- `scroll-snap-stop: always` 로 섹션 건너뜀 방지
- 데스크탑은 기존 일반 스크롤 유지

### 모바일 SNS 카드

| 항목 | 데스크탑 | 모바일 |
|--|--|--|
| 표시 방식 | 컨베이어 / 크로스페이드 (멀티 카드) | 1장씩 페이드 전환 |
| 카드 너비 | 고정 px | 전체폭 (꽉 채움) |
| 탐색 | 자동 스크롤 + 화살표 | 좌우 화살표 버튼 |
| 인디케이터 | — | 점 (≤10개) / 카운터 (>10개) |

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
YOUTUBE_CHANNEL_ID=UCn8qYoiJBSbzKj6KBBv136Q
YOUTUBE_API_KEY=...
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
# 수동: Morning Bakery/ 루트에서 실행 (frontend/ 내부 ❌)
npx vercel --prod
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
