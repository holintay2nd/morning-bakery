# 🥐 Morning Bakery — 공식 웹사이트

> 모닝베이커리의 브랜드 홈페이지. 메뉴 소개, 예약, SNS 피드 자동 연동을 제공합니다.

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
│  ┌──────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │  Header  │  │ SnsCarousel │  │  AdminDashboard  │   │
│  │  Footer  │  │ (자동 피드)  │  │  SnsManager      │   │
│  └──────────┘  └──────┬──────┘  └────────┬─────────┘   │
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
| `routes/instagram.js` | Instagram Graph API 프록시 (15분 캐시) |
| `routes/youtube.js` | YouTube Data API v3 또는 RSS 프록시 (15분 캐시) |
| `routes/threads.js` | Threads API 프록시 (15분 캐시) |
| `routes/naverblog.js` | 네이버 블로그 RSS 파싱 + 이미지 프록시 (SSRF 방지) |
| `middleware/auth.js` | JWT 검증 미들웨어 |
| `lib/cache-utils.js` | 15분 인메모리 캐시 팩토리 (`createCacheManager`) |
| `lib/xml-parser.js` | XML 파싱 유틸 (`extractXmlValue`, `stripHtml`, `extractFirstImage`) |
| `scripts/createAdmin.js` | 어드민 계정 초기 생성 스크립트 |

### 프론트엔드 (`/frontend/src`)

| 파일 | 역할 |
|------|------|
| `App.jsx` | 라우팅 설정 |
| `api.js` | Axios 인스턴스 + JWT 자동 첨부 인터셉터 |
| `components/Header.jsx` | 상단 네비게이션 |
| `components/Footer.jsx` | 하단 정보 |
| `components/SnsCarousel.jsx` | SNS 피드 캐러셀 — 반응형 그리드(모바일 2열 / 데스크톱 4열) |
| `admin/AdminDashboard.jsx` | 어드민 대시보드 레이아웃 |
| `admin/SnsManager.jsx` | SNS 자동연동 상태 카드 + 유튜브 채널ID·API키 입력 + 수동 기사 등록 |

---

## 🔗 SNS 자동 연동 방식

| SNS | 방식 | 설정 위치 | 특이사항 |
|-----|------|-----------|----------|
| **인스타그램** | Instagram Graph API | Heroku 환경변수 `INSTAGRAM_ACCESS_TOKEN` | 토큰 60일마다 갱신 필요 |
| **유튜브** | Data API v3 (기본) → RSS (폴백) | **어드민 페이지에서 직접 입력** | API 키 없으면 RSS 시도 (클라우드 환경에서 차단될 수 있음) |
| **스레드** | Threads API | Heroku 환경변수 `THREADS_ACCESS_TOKEN` | 토큰 60일마다 갱신 필요 |
| **네이버 블로그** | RSS 파싱 | Heroku 환경변수 `NAVER_BLOG_ID` | API 키 불필요, 완전 무료 |

> 모든 SNS 피드는 **15분 인메모리 캐시** 적용 — 외부 API 호출 최소화

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
| YouTube API 오류 | Google Cloud 결제 계정 미활성화 | 선불 결제 + API 키 어드민에서 직접 설정 가능하도록 변경 |
| YouTube RSS 404 | Heroku(AWS) IP 대역을 Google이 차단 | Data API v3 지원 추가, API 키 어드민 입력으로 해결 |
| Heroku git push 인증 실패 | 터미널 환경 달라 비밀번호 입력 불가 | 동일 터미널에서 `heroku login` 후 push |
| SSRF 취약점 | 이미지 프록시가 임의 URL 허용 | 네이버 CDN 도메인 허용 목록으로 제한 |
| 네이버 블로그 캐시 오염 | 프록시 URL이 캐시에 포함되어 IP 변경 시 깨짐 | raw URL 캐시 후 응답 시점에 프록시 URL 적용 |

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
- [ ] **SNS 섹션 디자인 개선** — 진행 예정

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

### 프론트엔드

- **공통 상태 카드** — `SnsStatusCard` 컴포넌트 하나로 인스타그램·스레드·네이버블로그 상태 표시 (설정 객체로 분기)
- **전용 설정 카드** — `YoutubeSettingsCard`는 입력 폼이 필요해 별도 컴포넌트
- **자동/수동 명확히 분리** — 자동 연동(4개 채널)과 수동 등록(기사)을 구분선으로 시각적 분리
- **반응형 캐러셀** — CSS Grid `grid-cols-2 lg:grid-cols-4`로 모바일 2열 / 데스크톱 4열
