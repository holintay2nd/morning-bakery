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
│              Heroku (백엔드 API)                           │
│             Node.js + Express   PORT 8000               │
│                                                         │
│  /api/auth          JWT 인증                             │
│  /api/menu          메뉴 관리                             │
│  /api/content       히어로·어바웃 콘텐츠                   │
│  /api/content/sns   SNS 수동 항목 CRUD                   │
│  /api/content/settings  유튜브 채널ID·API키 설정          │
│  /api/reservations  예약 관리                             │
│  /api/instagram     Instagram Graph API 프록시           │
│  /api/youtube       YouTube Data API v3 / RSS 프록시    │
│  /api/threads       Threads API 프록시                   │
│  /api/naverblog     네이버 블로그 RSS 파싱 + 이미지 프록시 │
└──────────────────────────┬──────────────────────────────┘
                           │
          ┌────────────────┼─────────────────┐
          ▼                ▼                 ▼
   ┌────────────┐  ┌──────────────┐  ┌───────────────┐
   │  MongoDB   │  │  외부 SNS API  │  │  Naver RSS    │
   │  Atlas     │  │  Instagram   │  │  blog.naver   │
   │            │  │  Threads     │  │  .com/feeds   │
   └────────────┘  │  YouTube     │  └───────────────┘
                   └──────────────┘
```

---

## 📁 주요 파일 역할

### 백엔드 (`/backend`)

| 파일 | 역할 |
|------|------|
| `server.js` | Express 앱 진입점, 라우트 등록 |
| `models/SiteContent.js` | 히어로·어바웃·SNS·설정 싱글톤 스키마 |
| `models/MenuItem.js` | 메뉴 아이템 스키마 |
| `models/Reservation.js` | 예약 스키마 |
| `models/Admin.js` | 어드민 계정 스키마 |
| `routes/auth.js` | 로그인 / JWT 발급 |
| `routes/content.js` | 콘텐츠 조회·수정 + SNS CRUD + 설정(유튜브 채널ID·API키) |
| `routes/menu.js` | 메뉴 CRUD |
| `routes/reservations.js` | 예약 CRUD |
| `routes/instagram.js` | Instagram Graph API 프록시 — 피드·프로필 병렬 조회, `{ items, username, profilePicture }` 반환 |
| `routes/youtube.js` | YouTube Data API v3 또는 RSS 프록시 (15분 캐시), `{ items, channelName, channelAvatar }` 반환 |
| `routes/threads.js` | Threads API 프록시 (15분 캐시), `{ items, username, profilePicture }` 반환 |
| `routes/naverblog.js` | 네이버 블로그 RSS 파싱 + 이미지 프록시 (SSRF 방지), `{ items, blogTitle }` 반환 |
| `middleware/auth.js` | JWT 검증 미들웨어 |
| `lib/cache-utils.js` | 15분 인메모리 캐시 팩토리 (`createCacheManager`) |
| `lib/xml-parser.js` | XML 파싱 유틸 (`extractXmlValue`, `stripHtml`, `extractFirstImage`) |
| `scripts/createAdmin.js` | 어드민 계정 초기 생성 스크립트 |

### 프론트엔드 (`/frontend/src`)

| 파일 | 역할 |
|------|------|
| `App.jsx` | 라우팅 설정 (홈 / 어드민 로그인 / 어드민 대시보드) |
| `api.js` | Axios 인스턴스 + JWT 자동 첨부 인터셉터 |
| `components/Header.jsx` | 상단 네비게이션 |
| `components/Footer.jsx` | 하단 정보 |
| `components/Hero.jsx` | 히어로 섹션 |
| `components/About.jsx` | 어바웃 섹션 |
| `components/SnsCarousel.jsx` | SNS 피드 — Instagram(컨베이어) · YouTube(크로스페이드) · NaverBlog(컨베이어) · Threads(컨베이어) |
| `components/StoreInfo.jsx` | 매장 안내 — 지도·영업시간·연락처, 다크 브라운(`bg-brown-900`) 테마 |
| `admin/AdminDashboard.jsx` | 어드민 대시보드 레이아웃 |
| `admin/SnsManager.jsx` | SNS 자동연동 상태 카드 + 유튜브 채널ID·API키 입력 |

---

## 📸 SNS 섹션 카드 디자인

### 인스타그램 (3:4 비율, 3장 고정 / 4장↑ 컨베이어)

```
┌──────────────────────────┐
│                          │
│     [이미지 3:4 비율]     │  ← 360px 폭
│                          │
│▓▓▓ 검정 그라데이션 ▓▓▓▓▓▓│
│ ◎  @morningbakery_seoul  │  ← 프로필 사진(실제) + 사용자명
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
│ b| 블로그명      2025.1.1  │  ← NaverBlog "b|" SVG + 날짜 우상단
│ 게시글 제목 (1줄 bold)     │
│ 내용 미리보기 (2줄)        │  ← min-h 유지로 카드 높이 통일
├────────────────────────────┤
│  ┌──────────────────────┐  │
│  │     [이미지 1:1]     │  │  ← 좌우 padding 맞춤, rounded-xl
│  └──────────────────────┘  │
└────────────────────────────┘
```

### 스레드 (3장 고정 / 4장↑ 컨베이어, Threads 앱 스타일)

```
┌────────────────────────────┐
│ ◎ morningbakery  4시간 전  │  ← 실제 프로필 사진 + 계정명 + 경과일
│                            │
│ 본문 텍스트                 │  ← 이미지 있으면 2줄 고정 / 없으면 최대 12줄
│ (2줄 min-h 고정)           │
│ ┌──────┐ ┌──────┐         │
│ │ 4:3  │ │ 4:3  │         │  ← 이미지 수에 따라 1~3열 그리드, rounded-xl
│ └──────┘ └──────┘         │
└────────────────────────────┘
```

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
| 스레드 | ≈373px | 3장 | 컨베이어 (20px/s) |

> **카드 폭 산출 기준**: `max-w-6xl` = 1152px  
> - 유튜브: `2 × 568 + 16 = 1152px` (꽉 채움)  
> - 블로그·스레드: `(1152 - 2 × 16) / 3 ≈ 373.33px` (꽉 채움, 유튜브와 좌우 정렬 일치)  
> - 인스타그램: `3 × 360 + 2 × 16 = 1112px` (컨베이어 특성상 넘쳐 흘러 정렬 자연스러움)

---

## 🔗 SNS 자동 연동 방식

| SNS | 방식 | 설정 위치 | 특이사항 |
|-----|------|-----------|----------|
| **인스타그램** | Instagram Graph API | Heroku 환경변수 `INSTAGRAM_ACCESS_TOKEN` | 토큰 60일마다 갱신 필요 |
| **유튜브** | Data API v3 (기본) → RSS (폴백) | **어드민 페이지에서 직접 입력** | API 키 없으면 RSS 시도 (클라우드에서 차단될 수 있음) |
| **스레드** | Threads Graph API (`graph.threads.net`) | Heroku 환경변수 `THREADS_ACCESS_TOKEN` | 토큰 60일마다 갱신 필요, `threads_profile_picture_url` 필드 사용 |
| **네이버 블로그** | RSS 파싱 + 이미지 프록시 | Heroku 환경변수 `NAVER_BLOG_ID` | API 키 불필요, 완전 무료 |

> 모든 SNS 피드는 **15분 인메모리 캐시** 적용 — 외부 API 호출 최소화

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
  "channelAvatar": "https://..."
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
> `images`: 캐러셀이면 자식 이미지 배열(최대 3장), 단일이면 `[media_url]`

### `/api/naverblog/feed`
```json
{
  "items": [{ "_id": "naver-xxx", "url": "https://blog.naver.com/...", "thumbnail": "/api/naverblog/proxy-image?url=...", "title": "...", "summary": "80자 미리보기", "timestamp": "..." }],
  "blogTitle": "모닝베이커리 공식 블로그"
}
```
> 썸네일은 응답 시점에 프록시 URL로 변환 (캐시엔 raw URL 저장)

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
NAVER_BLOG_ID=brandhub_official

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
| YouTube API 오류 | Google Cloud 결제 계정 미활성화 | 선불 결제 + API 키 어드민에서 직접 설정 가능하도록 변경 |
| YouTube RSS 404 | Heroku(AWS) IP 대역을 Google이 차단 | Data API v3 지원 추가, API 키 어드민 입력으로 해결 |
| YouTube 썸네일 저화질 | RSS fallback이 `hqdefault` 사용 | `maxresdefault` 우선, 로드 실패 시 `hqdefault` onError 폴백 |
| YouTube 카드 하단 모서리 각짐 | 외부 `<a>`에 `overflow-hidden`이 있어 썸네일 아래쪽이 잘림 | 썸네일 `<div>`에만 `rounded-2xl overflow-hidden` 적용 |
| **YouTube 전환 시 흰 화면 노출** | 두 레이어 동시 반투명 시 배경 노출 | 뒤 레이어 opacity 항상 1 고정, 앞 레이어만 1→0 페이드 (뒤가 항상 완전 커버) |
| Threads 계정명이 'threads' 표시 | `/me` 요청에 존재하지 않는 필드 포함 → API 오류 | 필드를 `id,username,threads_profile_picture_url`로 수정 |
| 인스타그램 캡션 잘림 | 60자 하드컷으로 줄바꿈 구조 파괴 | 백엔드 길이 제한 제거, 프론트 `line-clamp`으로 처리 |
| SSRF 취약점 | 이미지 프록시가 임의 URL 허용 | 네이버 CDN 도메인 허용 목록으로 제한 |
| Heroku git push 인증 실패 | 터미널 환경 달라 비밀번호 입력 불가 | 동일 터미널에서 `heroku login` 후 push |
| **NaverBlog 카드 왼쪽 잘림** | 카드 `marginRight` + flex `gap` 이중 적용 → 3장 합계 1160px > 1152px, `justify-center`가 초과분 분할 → 좌측 4px 클리핑 | `marginRight` 제거, flex `gap`으로 단일화 (이중 간격 제거) |
| **블로그·스레드 좌우 정렬 불일치** | 카드 폭 360px × 3 = 1112px로 컨테이너(1152px) 미충족, 스레드는 left-align으로 한쪽 치우침 | 카드 폭을 `(1152 - 2×16) / 3 ≈ 373px`로 변경 → 유튜브와 동일하게 컨테이너 꽉 채움 |
| **카드 하단 box-shadow 잘림** | `ConveyorWrap`의 `overflow-hidden`이 그림자 클리핑 | 래퍼에 `py-4` 추가로 상하 16px 여유 확보 |

---

## 🔒 보안 처리 내역

| 항목 | 처리 방법 |
|------|----------|
| 이미지 프록시 SSRF | `ALLOWED_IMAGE_HOSTS` 도메인 허용 목록 (네이버 CDN 6개 도메인만 허용) |
| 이미지 프록시 콘텐츠 검증 | `Content-Type: image/*` 아닌 응답 차단 |
| YouTube API 키 | 어드민 저장 후 클라이언트에 미노출 (`hasYoutubeApiKey` 불리언만 반환) |
| JWT 인증 | 모든 쓰기 엔드포인트에 `auth` 미들웨어 적용 |

---

## 📋 TODO

### 🔴 긴급
- [ ] **YouTube API 연동 완성** — Google Cloud 선불 결제 완료 후, 어드민에서 API 키 입력
- [ ] **Instagram 토큰 갱신** — 60일마다 만료, 자동 갱신 또는 알림 필요
- [ ] **Threads 토큰 갱신** — 동일

### 🟡 중요
- [ ] **Meta 앱 검수 제출** — 현재 개발 모드(테스터만 사용 가능)
- [ ] **Instagram/Threads 토큰 자동 갱신** — 백엔드에 60일 주기 갱신 엔드포인트 추가
- [ ] **Threads 이미지 하단 정렬 개선** — 텍스트 길이가 달라도 이미지가 동일한 Y 위치에 오도록 (카드 고정 높이 방식 검토)
- [ ] **Header 네비 링크 정리** — 케이크 예약 섹션 삭제 후 남은 링크 업데이트

### 🟢 개선
- [ ] **OG 이미지 추가** — SNS 공유 시 미리보기 이미지
- [ ] **sitemap.xml 생성** — 네이버·구글 SEO
- [ ] **robots.txt 추가**
- [ ] **SNS 토큰 만료 어드민 알림** — 만료 D-7 경고 표시
- [ ] **다중 고객 지원 구조** — 현재 단일 매장용, 향후 SaaS 확장 고려

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

- **캐시 패턴 통일** — `lib/cache-utils.js`의 `createCacheManager()`로 4개 SNS 라우트 모두 동일한 15분 캐시 구조 사용
- **XML 파싱 유틸 분리** — `lib/xml-parser.js`에 CDATA 처리, HTML 스트립, 이미지 추출 함수 집중
- **싱글톤 DB 패턴** — `SiteContent` 모델 하나로 히어로/어바웃/SNS/설정 모두 관리. `getOrCreateContent()`로 항상 존재 보장
- **DB 우선 / env 폴백** — 유튜브 채널ID·API키는 DB값 우선, 없으면 환경변수. 어드민에서 Heroku 없이 변경 가능
- **캐시 재사용** — `/status` 엔드포인트는 피드 캐시가 유효하면 재조회 없이 캐시 데이터 반환

### 프론트엔드 (`SnsCarousel.jsx`)

- **`useConveyorBelt` 훅** — RAF 애니메이션 + 수동 스크롤 로직을 단일 훅으로 추출. 인스타·블로그·스레드 재사용
- **`ConveyorWrap` 컴포넌트** — 화살표 버튼 + overflow 래퍼 + 자동/고정 트랙 분기 공통화
- **단일 gap 원칙** — 모든 섹션 `CARD_GAP = 16`. 카드에 `marginRight` 없음, flex `gap`만 사용 (이중 간격 방지)
- **카드 폭 상수** — `IG_CARD_W = 360`, `YT_CARD_W = 568`, `NB_CARD_W = TH_CARD_W = (1152-32)/3`. 모두 max-w-6xl 기준으로 산출
- **YouTube 크로스페이드** — state: `[cur, next, isFading]` 쌍 × 2슬롯. 뒤 레이어 `position:absolute, z:1, opacity:1` 고정. 앞 레이어 `position:relative, z:2`만 페이드. `transition:none`으로 즉시 복원
- **섹션별 전용 컴포넌트** — `InstagramSection`, `YoutubeSection`, `NaverBlogSection`, `ThreadsSection` 각각 독립 컴포넌트
- **RAF 기반 스크롤** — `requestAnimationFrame` 60fps GPU 가속, state re-render 없이 `ref`로 직접 DOM 제어

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
| `PreToolUse(Bash)` | Bash 명령 실행 직전 (권한 다이얼로그 포함) | Tink.aiff (소음 최소화) | — |

### 배너가 안 뜰 때

`terminal-notifier` 알림은 전달되지만 **Focus 모드(집중 모드)** 가 켜져 있으면 배너로 표시되지 않음.

- 시스템 설정 → 집중 모드 → 활성 프로필 → **앱 허용 목록에 `terminal-notifier` 추가**
- 또는 Focus 모드 해제

> 소리(`afplay`)는 Focus 모드와 무관하게 항상 재생됨
