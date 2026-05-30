# 🥐 Morning Bakery — 공식 웹사이트

> 모닝베이커리의 브랜드 홈페이지. 메뉴 소개, SNS 피드 자동 연동, 매장 안내를 제공합니다.

---

## 🌐 서비스 URL

| 구분 | URL |
|------|-----|
| 프론트엔드 (라이브) | https://morningbakery.co.kr |
| 백엔드 API | https://morningbakery-api-6391c51d5a00.herokuapp.com/api |
| 어드민 페이지 | https://morningbakery.co.kr/admin |

---

## 🏗️ 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                      사용자 브라우저                         │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel (프론트엔드)                            │
│         React + Vite   morningbakery.co.kr              │
│                                                         │
│  ┌──────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │  Header  │  │  SnsCarousel    │  │ AdminDashboard│  │
│  │  Footer  │  │ InstagramSection│  │ SnsManager    │  │
│  └──────────┘  │ YoutubeSection  │  └───────────────┘  │
│                │ NaverBlogSection│                      │
│                │ ThreadsSection  │                      │
│                └────────┬────────┘                      │
└─────────────────────────────────────────────────────────┘
                          │ API 요청
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Heroku (백엔드 API)  Eco Dyno               │
│             Node.js + Express   PORT 8000               │
│                                                         │
│  /api/auth              JWT 인증                         │
│  /api/menu              메뉴 관리                         │
│  /api/content           히어로·어바웃 콘텐츠               │
│  /api/content/sns       SNS 수동 항목 CRUD               │
│  /api/content/settings  유튜브 채널ID·API키 설정          │
│  /api/content/sns-taglines  SNS 뱃지 태그라인 설정        │
│  /api/instagram         Instagram Graph API 프록시       │
│  /api/youtube           YouTube Data API v3 / RSS 프록시│
│  /api/threads           Threads API 프록시               │
│  /api/naverblog         네이버 블로그 RSS + 이미지 프록시  │
│  /api/health            Dyno 상태 확인 (keep-alive용)    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │           sns-prefetch.js (cron)                │   │
│  │  서버 기동 시: DB → 인메모리 로드 (cold start 대응)│   │
│  │  15분마다: 외부 API 재조회 → 인메모리 + DB 갱신   │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────┘
                           │
          ┌────────────────┼─────────────────┐
          ▼                ▼                 ▼
   ┌────────────┐  ┌──────────────┐  ┌───────────────┐
   │  MongoDB   │  │  외부 SNS API  │  │  Naver RSS    │
   │  Atlas     │  │  Instagram   │  │  blog.naver   │
   │ SnsCache ← │  │  Threads     │  │  .com/feeds   │
   │ (피드 캐시) │  │  YouTube     │  └───────────────┘
   └────────────┘  └──────────────┘
```

---

## 📁 주요 파일 역할

### 백엔드 (`/backend`)

| 파일 | 역할 |
|------|------|
| `server.js` | Express 앱 진입점, 라우트 등록, `initSnsPrefetch()` 호출 |
| `models/SiteContent.js` | 히어로·어바웃·SNS·설정·**snsTaglines** 싱글톤 스키마 |
| `models/SnsCache.js` | **NEW** SNS 피드 MongoDB 캐시 (Dyno 재기동 후 복원용) |
| `models/MenuItem.js` | 메뉴 아이템 스키마 |
| `models/Reservation.js` | 예약 스키마 |
| `models/Admin.js` | 어드민 계정 스키마 |
| `routes/auth.js` | 로그인 / JWT 발급 |
| `routes/content.js` | 콘텐츠 조회·수정 + SNS CRUD + 설정 + **태그라인 GET·PATCH** |
| `routes/menu.js` | 메뉴 CRUD |
| `routes/reservations.js` | 예약 CRUD |
| `routes/instagram.js` | `getCache` / `refreshAndCache` 경유, `{ items, username, profilePicture }` |
| `routes/youtube.js` | `getCache` / `refreshAndCache` 경유, `{ items, channelName, channelAvatar, channelUrl }` |
| `routes/threads.js` | `getCache` / `refreshAndCache` 경유, `{ items, username, profilePicture }` |
| `routes/naverblog.js` | `getCache` / `refreshAndCache` 경유, `{ items, blogTitle, blogUrl }` + 이미지 프록시 |
| `middleware/auth.js` | JWT 검증 미들웨어 |
| `lib/cache-utils.js` | 15분 인메모리 캐시 팩토리 (레거시, 라우트에서 직접 미사용) |
| `lib/xml-parser.js` | XML 파싱 유틸 (`extractXmlValue`, `stripHtml`, `extractFirstImage`) |
| `lib/sns-fetchers.js` | **NEW** 4개 플랫폼 순수 fetch 함수 (캐시·라우팅 로직 없음) |
| `lib/sns-prefetch.js` | **NEW** 인메모리+DB 캐시 관리자 + 15분 cron (`getCache`, `refreshAndCache`, `initSnsPrefetch`) |
| `scripts/createAdmin.js` | 어드민 계정 초기 생성 스크립트 |

### 프론트엔드 (`/frontend/src`)

| 파일 | 역할 |
|------|------|
| `App.jsx` | 라우팅 설정 (홈 / 어드민 로그인 / 어드민 대시보드) |
| `api.js` | Axios 인스턴스 + JWT 자동 첨부 인터셉터 |
| `components/Header.jsx` | 네비게이션 — HOME · INTRODUCE · SNS(드롭다운) · CONTACT |
| `components/Footer.jsx` | 하단 정보 |
| `components/Hero.jsx` | 히어로 섹션 — SNS 아이콘 뱃지 4개 (글래스모피즘 원형, 클릭 시 각 플랫폼 이동) |
| `components/About.jsx` | INTRODUCE 섹션 |
| `components/SnsCarousel.jsx` | SNS 피드 오케스트레이터 — 6개 병렬 fetch (피드×4 + sns + taglines) |
| `components/StoreInfo.jsx` | CONTACT 섹션 — 지도·영업시간·연락처 |
| `components/Menu.jsx` | 메뉴 섹션 |
| `components/sns/config.jsx` | `SNS_CONFIG` 배열 (4개 플랫폼 메타), `CARD_GAP = 16` |
| `components/sns/utils.js` | `formatRelativeDate`, `formatViewCount`, `parseCaption`, `formatBlogDate` |
| `components/sns/SectionHeader.jsx` | 플랫폼 뱃지 (클릭 시 `profileUrl` 이동) + 태그라인 텍스트 (`text-sm`, `gap-3`) |
| `components/sns/ConveyorWrap.jsx` | 컨베이어 래퍼 (화살표 버튼, `pb-6` — 상단 여백 제거로 섹션 간격 통일) |
| `components/sns/SnsSkeleton.jsx` | **NEW** shimmer 스켈레톤 UI (4개 섹션 형태 모사) |
| `components/sns/InstagramSection.jsx` | IG 카드 (3:4, 컨베이어) — 계정명 옆 상대 시간 표시 — `id="sns-instagram"` |
| `components/sns/YoutubeSection.jsx` | YT 카드 (크로스페이드) — `id="sns-youtube"` |
| `components/sns/NaverBlogSection.jsx` | 블로그 카드 (컨베이어) — 헤더에 DefaultAvatar 사람 아이콘 — `id="sns-naverblog"` |
| `components/sns/ThreadsSection.jsx` | 스레드 카드 (3-슬롯 크로스페이드, `TH_MIN_CARD_H`로 고정 높이) — `id="sns-threads"` |
| `hooks/useConveyorBelt.js` | RAF 스크롤 훅 (인스타·블로그 공유; Threads는 크로스페이드로 분리) |
| `admin/AdminDashboard.jsx` | 어드민 대시보드 레이아웃 |
| `admin/SnsManager.jsx` | SNS 관리 — **태그라인 편집 패널** + 자동연동 상태 카드 + 유튜브 채널ID·API키 |

---

## 🔄 SNS 로딩 최적화 (캐시 계층)

```
요청 처리 흐름
  ① getCache('instagram')   → 인메모리 hit  → 즉시 응답 (~0ms)
  ② 캐시 miss               → refreshAndCache() 외부 API 호출 → 인메모리 + DB 저장

서버 기동 시 (Dyno cold start)
  ① warmFromDb()            → MongoDB에서 인메모리로 복원 (~50ms)
  ② 만료 캐시만             → 비동기 refreshAll() (서버 기동 블록 안 함)
  ③ setInterval(15분)       → cron 시작

효과
  Before: Dyno 기동 + 외부 API 4개 = 5~30s + 1~2s
  After:  Dyno 기동 + DB 1번 조회  = 5~30s + ~50ms
```

> **Keep-alive 권장**: UptimeRobot 등으로 `/api/health` 20분 간격 ping → Dyno cold start 자체 방지  
> 클라이언트 규모화 시 GitHub Actions cron 1개로 전체 클라이언트 ping 일원화 가능

---

## 🧭 네비게이션 구조

| 메뉴 | 스크롤 대상 | 비고 |
|------|------------|------|
| HOME | `#home` | Hero 섹션 |
| INTRODUCE | `#about` | About 섹션 |
| SNS ▾ | `#sns` | 호버 드롭다운 |
| └ Instagram | `#sns-instagram` | 인스타그램 섹션 |
| └ YouTube | `#sns-youtube` | 유튜브 섹션 |
| └ Naver Blog | `#sns-naverblog` | 블로그 섹션 |
| └ Threads | `#sns-threads` | 스레드 섹션 |
| CONTACT | `#store` | StoreInfo 섹션 |

---

## 📸 SNS 섹션 카드 디자인

### 인스타그램 (3:4 비율, 3장 고정 / 4장↑ 컨베이어)

```
┌──────────────────────────┐
│                          │
│     [이미지 3:4 비율]     │  ← 360px 폭
│                          │
│▓▓▓ 검정 그라데이션 ▓▓▓▓▓▓│
│ ◎  @morningbakery  · 3일 전│  ← 프로필 사진(실제) + 사용자명 + 상대 시간
│ 제목 (첫 번째 캡션 줄)    │  ← white bold, 1줄
│ 본문 (나머지 캡션)        │  ← white/70, 최대 2줄
└──────────────────────────┘
```

### 유튜브 (16:9 비율, 2장 고정 — 크로스페이드 전환)

```
┌───────────────────────────────────────┐
│                                       │
│          [썸네일 16:9 비율]            │  ← 568px 폭, rounded-2xl
│                                       │
└───────────────────────────────────────┘
 ◉  영상 제목 (최대 2줄)                 ← 채널 아바타(실제) + 제목
    채널명 · 조회수 · 업로드 경과일       ← text-xs text-brown-400
```

> **크로스페이드 전환**: A|B → C|B → C|D 순으로 5초마다 한 슬롯씩 교체 (1.2초 페이드)  
> 뒤 레이어(next) 항상 opacity 1 고정, 앞 레이어(cur)만 1→0 페이드아웃 → 흰 화면 노출 없음  
> 마우스 오버 시 자동 전환 일시정지

### 네이버 블로그 (3장 고정 / 4장↑ 컨베이어)

```
┌────────────────────────────┐
│ 👤 블로그명      2025.1.1  │  ← 사람 아바타(DefaultAvatar) + 블로그명 + 날짜 우상단
│ 게시글 제목 (1줄 bold)     │
│ 내용 미리보기 (2줄)        │  ← min-h 유지로 카드 높이 통일
├────────────────────────────┤
│  ┌──────────────────────┐  │
│  │     [이미지 1:1]     │  │  ← 좌우 padding 맞춤, rounded-xl
│  └──────────────────────┘  │
└────────────────────────────┘
```

### 스레드 (3장 고정 / 4장↑ 크로스페이드, Threads 앱 스타일)

```
┌────────────────────────────┐
│ ◎ morningbakery  4시간 전  │  ← 실제 프로필 사진 + 계정명 + 경과일
│                            │
│ 본문 텍스트                 │  ← 이미지 있으면 2줄 고정 / 없으면 최대 12줄
│ ┌──────┐ ┌──────┐         │
│ │ 4:3  │ │ 4:3  │         │  ← 이미지 수에 따라 1~3열 그리드, rounded-xl
│ └──────┘ └──────┘         │
└────────────────────────────┘
```

> **크로스페이드 전환 (YouTube와 동일 방식, 동시 페이드)**: 3슬롯 각각 5초마다 순차 교체  
> 카드 높이가 가변이라 cur(1→0)·next(0→1) 동시 opacity 전환으로 툭 튀는 현상 방지  
> `TH_MIN_CARD_H ≈ 385px` 고정으로 CONTACT 섹션 위치 점프 방지  
> 4개↑ 아이템: 순환 커서로 화면 내 중복 없이 교체 / 3개↓: 고정 표시

---

## 🎠 컨베이어 벨트 공통 동작

| 조건 | 동작 |
|------|------|
| 카드 수 ≤ 표시 수 | 고정 그리드 (스크롤 없음) |
| 카드 수 > 표시 수 | 자동 좌측 스크롤 (20px/s, `requestAnimationFrame`) |
| **마우스 오버** | 즉시 일시정지 |
| **← → 화살표 클릭** | 1카드 단위 수동 이동 |

| 섹션 | 카드 폭 | 표시 수 | 방식 |
|------|---------|---------|------|
| 인스타그램 | 360px | 3장 | 컨베이어 (20px/s) |
| 유튜브 | 568px | 2장 | **크로스페이드** (5초 주기) |
| 네이버 블로그 | ≈373px | 3장 | 컨베이어 (20px/s) |
| 스레드 | ≈373px | 3장 | **크로스페이드** (5초 주기, 동시 페이드) |

> **카드 폭 산출 기준**: `max-w-6xl` = 1152px  
> - 유튜브: `2 × 568 + 16 = 1152px` (꽉 채움)  
> - 블로그·스레드: `(1152 - 2 × 16) / 3 ≈ 373.33px` (꽉 채움, 유튜브와 좌우 정렬 일치)  
> - 인스타그램: `3 × 360 + 2 × 16 = 1112px` (컨베이어 특성상 넘쳐 흘러 자연스러움)

---

## 🔗 SNS 자동 연동 방식

| SNS | 방식 | 설정 위치 | 특이사항 |
|-----|------|-----------|----------|
| **인스타그램** | Instagram Graph API | Heroku 환경변수 `INSTAGRAM_ACCESS_TOKEN` | 토큰 60일마다 갱신 필요 |
| **유튜브** | Data API v3 → RSS (폴백) | **어드민 페이지에서 직접 입력** | API 키 없으면 RSS 시도 |
| **스레드** | Threads Graph API | Heroku 환경변수 `THREADS_ACCESS_TOKEN` | 토큰 60일마다 갱신 필요 |
| **네이버 블로그** | RSS 파싱 + 이미지 프록시 | Heroku 환경변수 `NAVER_BLOG_ID` | API 키 불필요, 완전 무료 |

> 모든 SNS 피드: **인메모리(15분) + MongoDB(Dyno 재기동 복원)** 이중 캐시 적용

---

## 🦸 히어로 섹션 SNS 아이콘 뱃지

```
┌────────────────────────────────────────────┐
│                                            │
│          Morning Bakery (배경 이미지)        │
│                                            │
│    ○IG   ○YT   ○N   ○Threads              │  ← 글래스모피즘 원형 아이콘
│    (각 아이콘 클릭 시 플랫폼 새 탭 이동)      │
└────────────────────────────────────────────┘
```

- **스타일**: `bg-white/[0.07] border border-white/[0.15]` 글래스모피즘, hover 시 `bg-white/[0.14]`
- **아이콘**: Simple Icons 공식 SVG (Instagram, YouTube, Naver "N", Threads), fill-white
- **URL 로드**: `/feed` 엔드포인트 4개에서 사용자명·채널URL 병렬 fetch (인메모리 캐시로 즉시 응답)
- URL 없을 땐 `<span>` (비활성), URL 있을 땐 `<a target="_blank">` (활성)

---

## 🏷️ SNS 뱃지 기능

- **Simple Icons 공식 SVG**: 모든 아이콘 `simpleicons.org` 기준 최신 경로 사용
  - Instagram / YouTube: `w-4 h-4` / `w-5 h-5`
  - Naver "N": `w-3 h-3` (viewBox 100% 채움으로 같은 CSS 크기에서 더 커보여 축소)
  - Threads: `w-4 h-4`
- **클릭 → 플랫폼 이동**: 인스타그램(`instagram.com/{username}`), 유튜브(`youtube.com/channel/{id}`), 블로그(`blog.naver.com/{id}`), 스레드(`threads.net/@{username}`) 새 탭 열기
- **태그라인**: 어드민 → SNS 관리 → "뱃지 태그라인" 패널에서 입력, `GET /api/content/sns-taglines` 공개 조회, `PATCH /api/content/sns-taglines` 어드민 수정

---

## 📦 백엔드 API 응답 형식

### `/api/instagram/feed`
```json
{
  "items": [{ "_id": "...", "url": "...", "thumbnail": "...", "title": "캡션(해시태그 제거)", "mediaType": "IMAGE", "timestamp": "..." }],
  "username": "morningbakery_seoul",
  "profilePicture": "https://..."
}
```

### `/api/youtube/feed`
```json
{
  "items": [{ "_id": "videoId", "url": "...", "thumbnail": "maxresdefault.jpg", "title": "...", "timestamp": "...", "viewCount": "12345" }],
  "channelName": "모닝베이커리",
  "channelAvatar": "https://...",
  "channelUrl": "https://www.youtube.com/channel/UCxxx"
}
```
> API 키 없으면 RSS 폴백 → `channelAvatar: ''`, `viewCount: ''`

### `/api/threads/feed`
```json
{
  "items": [{ "_id": "...", "url": "...", "images": ["url1", "url2"], "thumbnail": "url1", "text": "본문(해시태그 제거)", "mediaType": "CAROUSEL_ALBUM", "timestamp": "..." }],
  "username": "morningbakery_seoul",
  "profilePicture": "https://..."
}
```

### `/api/naverblog/feed`
```json
{
  "items": [{ "_id": "naver-xxx", "url": "https://blog.naver.com/...", "thumbnail": "/api/naverblog/proxy-image?url=...", "title": "...", "summary": "80자 미리보기", "timestamp": "..." }],
  "blogTitle": "모닝베이커리 공식 블로그",
  "blogUrl": "https://blog.naver.com/morningbakery"
}
```
> 썸네일: 응답 시점에 프록시 URL 변환 (캐시엔 raw URL 저장)

### `/api/content/sns-taglines` (GET 공개 / PATCH 어드민)
```json
{
  "instagram": "일상의 순간들을 공유합니다",
  "youtube": "베이킹 영상을 업로드합니다",
  "naverBlog": "레시피와 이야기를 나눕니다",
  "threads": "오늘의 소식을 전합니다"
}
```

---

## ⚙️ 환경 변수

### 백엔드 (`backend/.env` 및 Heroku Config Vars)

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
PORT=8000
ADMIN_EMAIL=admin@morningbakery.co.kr
ADMIN_PASSWORD=...
FRONTEND_URL=https://morningbakery.co.kr

# SNS 연동 (유튜브는 어드민에서 직접 설정 가능)
INSTAGRAM_ACCESS_TOKEN=...
THREADS_ACCESS_TOKEN=...
NAVER_BLOG_ID=morningbakery

# 유튜브 (어드민 DB 설정값이 우선, 없을 때만 아래 env var 사용)
YOUTUBE_CHANNEL_ID=UCn8qYoiJBSbzKj6KBBv136Q
YOUTUBE_API_KEY=...
```

### 프론트엔드 (`frontend/.env`)

```env
VITE_API_URL=https://morningbakery-api-6391c51d5a00.herokuapp.com/api
```

---

## 🛠️ 해결한 주요 문제들

| 문제 | 원인 | 해결 |
|------|------|------|
| SNS 항목 추가 실패 | SNS 라우트가 Heroku에 미배포 | 백엔드 커밋 후 `git push heroku main` |
| 인스타그램 테스터 권한 오류 | 인스타그램 계정이 앱 테스터로 미등록 | Meta Developer → 앱 역할 → 테스터 추가 |
| 네이버 블로그 썸네일 안 보임 | 네이버 CDN 외부 핫링크 차단 | 백엔드 이미지 프록시 엔드포인트 추가 |
| 네이버 블로그 링크 오작동 | RSS `<link>` CDATA 미처리 | 링크 파싱 정규식에 CDATA 처리 추가 |
| 네이버 블로그 캐시 오염 | 프록시 URL이 캐시에 포함되어 IP 변경 시 깨짐 | raw URL 캐시 후 응답 시점에 프록시 URL 적용 |
| YouTube API 오류 | Google Cloud 결제 계정 미활성화 | 선불 결제 + API 키 어드민에서 직접 설정 |
| YouTube RSS 404 | Heroku(AWS) IP 대역을 Google이 차단 | Data API v3 지원 추가, API 키 어드민 입력 |
| YouTube 썸네일 저화질 | RSS fallback이 `hqdefault` 사용 | `maxresdefault` 우선, 로드 실패 시 onError 폴백 |
| YouTube 카드 하단 모서리 각짐 | 외부 `<a>`의 `overflow-hidden`이 썸네일 아래 클리핑 | 썸네일 `<div>`에만 `rounded-2xl overflow-hidden` 적용 |
| YouTube 전환 시 흰 화면 노출 | 두 레이어 동시 반투명 → 배경 노출 | 뒤 레이어 opacity 1 고정, 앞 레이어만 1→0 페이드 |
| Threads 계정명이 'threads' 표시 | `/me` 요청에 없는 필드 → API 오류 | 필드를 `id,username,threads_profile_picture_url`로 수정 |
| 인스타그램 캡션 잘림 | 60자 하드컷으로 줄바꿈 구조 파괴 | 백엔드 길이 제한 제거, 프론트 `line-clamp`으로 처리 |
| SSRF 취약점 | 이미지 프록시가 임의 URL 허용 | 네이버 CDN 도메인 허용 목록으로 제한 |
| NaverBlog 카드 왼쪽 잘림 | `marginRight` + flex `gap` 이중 적용 초과 | `marginRight` 제거, flex `gap` 단일화 |
| 블로그·스레드 좌우 정렬 불일치 | 카드 폭 360px × 3 = 1112px로 컨테이너 미충족 | 카드 폭을 `(1152-32)/3 ≈ 373px`로 변경 |
| 카드 하단 box-shadow 잘림 | `overflow-hidden`이 그림자 클리핑 | 래퍼에 `py-4` 추가로 상하 여유 확보 |
| **Threads 카드 높이 동일화** | flex 기본 `align-items: stretch`로 모든 카드가 최고 높이로 늘어남 | `ConveyorWrap`에 `alignStart` prop → `alignItems: 'flex-start'` 인라인 스타일 (Tailwind JIT 우회) |
| **SNS 섹션 첫 로딩 2~5초 지연** | Dyno cold start 후 인메모리 캐시 소실 → 외부 API 4개 재호출 | `SnsCache` MongoDB 모델 + `sns-prefetch.js` 이중 캐시 구조 도입 |
| **YouTube·NaverBlog 뱃지 클릭 불가** | 신규 `channelUrl`/`blogUrl` 필드가 구 캐시 포맷에 없어 `undefined` | 라우트에서 `cachedForChannelId`·환경변수로 폴백 파생 |
| **히어로 스크롤 화살표 가운데 아님** | `left-1/2 -translate-x-1/2` 방식 오차 | `inset-x-0 flex justify-center`로 변경 + 커스텀 SVG 적용 |
| **Threads 섹션 높이 점프** | 텍스트 전용 카드(짧음)↔이미지 카드(긺) 교체 시 CONTACT 섹션 위치 변동 | `TH_MIN_CARD_H = ceil(54+58+(카드폭-28)×0.75+14) ≈ 385px` 산출, 모든 슬롯에 `minHeight` 적용 |
| **Threads 크로스페이드 "팝" 현상** | YouTube 방식(뒤 레이어 opacity:1 고정, 앞만 페이드)에서 가변 높이 카드가 툭 튀어남 | cur 1→0 + next 0→1 동시 전환 (`transition` 동기화) |
| **ConveyorWrap 상단 여백 불일치** | `py-4`로 상단 16px 패딩 → Instagram·NaverBlog가 YouTube·Threads보다 뱃지와 더 멀어짐 | `py-4` → `pb-6` (상단 패딩 제거) |
| **Hero 아이콘 뿌연 현상** | 전체 요소에 `opacity-40` 적용 → 아이콘까지 반투명 | 요소 opacity 제거 후 배경색 투명도만 `bg-white/[0.07]`로 조절 |

---

## 🔒 보안 처리 내역

| 항목 | 처리 방법 |
|------|----------|
| 이미지 프록시 SSRF | `ALLOWED_IMAGE_HOSTS` 도메인 허용 목록 (네이버 CDN 6개 도메인만 허용) |
| 이미지 프록시 콘텐츠 검증 | `Content-Type: image/*` 아닌 응답 차단 |
| YouTube API 키 | 어드민 저장 후 클라이언트에 미노출 (`hasYoutubeApiKey` 불리언만 반환) |
| JWT 인증 | 모든 쓰기 엔드포인트에 `auth` 미들웨어 적용 |
| CORS 제한 | `FRONTEND_URL` 환경변수 기반 허용 오리진 제한 |
| 404 처리 | 존재하지 않는 라우트 404 JSON 응답 |

---

## 📋 TODO

### 🔴 긴급
- [ ] **Instagram 토큰 갱신** — 60일마다 만료, 자동 갱신 또는 알림 필요
- [ ] **Threads 토큰 갱신** — 동일

### 🟡 중요
- [ ] **Meta 앱 검수 제출** — 현재 개발 모드(테스터만 사용 가능)
- [ ] **Instagram/Threads 토큰 자동 갱신** — 백엔드에 60일 주기 갱신 엔드포인트 추가
- [ ] **Keep-alive 설정** — UptimeRobot 또는 GitHub Actions cron으로 `/api/health` 20분 ping (Eco Dyno sleep 방지)
- [ ] **SNS 토큰 만료 어드민 알림** — 만료 D-7 경고 표시

### 🟢 개선
- [ ] **OG 이미지 추가** — SNS 공유 시 미리보기 이미지
- [ ] **sitemap.xml 생성** — 네이버·구글 SEO
- [ ] **robots.txt 추가**
- [ ] **다중 고객 멀티테넌트 구조** — 현재 단일 매장용, 향후 SaaS 확장 시 `siteSlug` 기반 분리 필요

---

## 🚀 배포 방법

### 백엔드 (Heroku)
```bash
cd backend
git add -A
git commit -m "변경 내용"
git push heroku main
```

### 프론트엔드 (Vercel 자동 배포)
```bash
# 루트 디렉토리에서
git add -A
git commit -m "변경 내용"
git push origin main
# → GitHub push 감지 시 Vercel이 자동 빌드·배포
```

### 환경 변수 설정 (Heroku)
```bash
heroku config:set KEY=VALUE --app morningbakery-api
```

---

## 👤 어드민 접속

- URL: `https://morningbakery.co.kr/admin`
- 계정 정보: `backend/.env` 참고 (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)

---

## 🧩 코드 구조 설계 원칙

### 백엔드

- **이중 캐시 구조** — 인메모리(속도) + MongoDB(Dyno 재기동 복원). `sns-prefetch.js`가 단일 진입점
- **순수 fetch 함수 분리** — `lib/sns-fetchers.js`에 외부 API 호출 로직 집중, 라우트는 캐시 조회·에러 처리만 담당
- **in-flight 중복 방지** — 동일 key에 대한 동시 refresh 요청은 하나의 Promise를 공유
- **XML 파싱 유틸 분리** — `lib/xml-parser.js`에 CDATA 처리, HTML 스트립, 이미지 추출 함수 집중
- **싱글톤 DB 패턴** — `SiteContent` 모델 하나로 히어로/어바웃/SNS/설정/태그라인 모두 관리
- **DB 우선 / env 폴백** — 유튜브 채널ID·API키는 DB값 우선, 없으면 환경변수

### 프론트엔드

- **`useConveyorBelt` 훅** — RAF 애니메이션 + 수동 스크롤 로직을 단일 훅으로 추출. 인스타·블로그 재사용 (Threads는 크로스페이드로 분리)
- **`ConveyorWrap` 컴포넌트** — 화살표 버튼 + overflow 래퍼 + 자동/고정 트랙 분기 공통화 (`pb-6`로 상단 패딩 없이 뱃지-콘텐츠 간격 통일)
- **단일 gap 원칙** — 모든 섹션 `CARD_GAP = 16`. 카드에 `marginRight` 없음, flex `gap`만 사용
- **카드 폭 상수** — `IG_CARD_W = 360`, `YT_CARD_W = 568`, `NB_CARD_W = TH_CARD_W = (1152-32)/3`
- **YouTube·Threads 크로스페이드** — YouTube: 뒤 레이어 `opacity:1` 고정, 앞만 1→0 페이드 / Threads: 가변 높이 대응을 위해 cur(1→0)·next(0→1) 동시 전환
- **Threads 고정 높이** — `TH_MIN_CARD_H` 산출식으로 섹션 높이 고정 → 하단 섹션 위치 점프 방지
- **섹션별 앵커 ID** — `#sns-instagram`, `#sns-youtube`, `#sns-naverblog`, `#sns-threads` → 네비 드롭다운 연동
- **Hero SNS 뱃지** — `SNS_ICONS` 배열 + `snsLinks` state. 피드 엔드포인트 4개 병렬 fetch, URL 있으면 `<a>` 없으면 `<span>` 분기

---

## 🔔 Claude Code 알림 설정 (개발 환경)

작업 완료·권한 요청 시 macOS 알림이 울리도록 `~/.claude/settings.json` 훅을 설정해뒀음.

### 설치 전제
```bash
brew install terminal-notifier   # macOS 알림 배너 도구
```

### 훅 동작

| 훅 | 트리거 | 소리 | 배너 |
|----|--------|------|------|
| `Stop` | 작업 완료 | CC Ring 확장 사운드 | "작업이 완료되었습니다" |
| `Notification` | 백그라운드 대기 / 입력 필요 | Funk.aiff | "입력 또는 권한 확인이 필요합니다" |
| `PreToolUse(Bash)` | Bash 명령 실행 직전 | Tink.aiff (소음 최소화) | — |

### 배너가 안 뜰 때

`terminal-notifier` 알림은 전달되지만 **Focus 모드(집중 모드)** 가 켜져 있으면 배너로 표시되지 않음.

- 시스템 설정 → 집중 모드 → 활성 프로필 → **앱 허용 목록에 `terminal-notifier` 추가**
- 또는 Focus 모드 해제

> 소리(`afplay`)는 Focus 모드와 무관하게 항상 재생됨
