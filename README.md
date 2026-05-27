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
│  /api/content/sns   SNS 수동 항목 관리                    │
│  /api/reservations  예약 관리                             │
│  /api/instagram     Instagram Graph API 프록시           │
│  /api/youtube       YouTube RSS 피드 (→ Data API 예정)  │
│  /api/threads       Threads API 프록시                   │
│  /api/naverblog     네이버 블로그 RSS 프록시               │
└──────────────────────────┬──────────────────────────────┘
                           │
          ┌────────────────┼─────────────────┐
          ▼                ▼                 ▼
   ┌────────────┐  ┌──────────────┐  ┌───────────────┐
   │  MongoDB   │  │  외부 SNS API  │  │  Naver RSS    │
   │  Atlas     │  │  Instagram   │  │  blog.naver   │
   │            │  │  Threads     │  │  .com RSS     │
   └────────────┘  │  YouTube     │  └───────────────┘
                   └──────────────┘
```

---

## 📁 주요 파일 역할

### 백엔드 (`/backend`)

| 파일 | 역할 |
|------|------|
| `server.js` | Express 앱 진입점, 라우트 등록 |
| `models/SiteContent.js` | 히어로·어바웃·SNS 콘텐츠 싱글톤 스키마 |
| `models/MenuItem.js` | 메뉴 아이템 스키마 |
| `models/Reservation.js` | 예약 스키마 |
| `models/Admin.js` | 어드민 계정 스키마 |
| `routes/auth.js` | 로그인 / JWT 발급 |
| `routes/content.js` | 콘텐츠 조회·수정 + SNS 수동 항목 CRUD |
| `routes/menu.js` | 메뉴 CRUD |
| `routes/reservations.js` | 예약 CRUD |
| `routes/instagram.js` | Instagram Graph API 프록시 (15분 캐시) |
| `routes/youtube.js` | YouTube Data API v3 프록시 (15분 캐시) |
| `routes/threads.js` | Threads API 프록시 (15분 캐시) |
| `routes/naverblog.js` | 네이버 블로그 RSS 파싱 + 이미지 프록시 |
| `middleware/auth.js` | JWT 검증 미들웨어 |
| `scripts/createAdmin.js` | 어드민 계정 초기 생성 스크립트 |

### 프론트엔드 (`/frontend/src`)

| 파일 | 역할 |
|------|------|
| `App.jsx` | 라우팅 설정 |
| `api.js` | Axios 인스턴스 + JWT 자동 첨부 인터셉터 |
| `components/Header.jsx` | 상단 네비게이션 |
| `components/Footer.jsx` | 하단 정보 |
| `components/SnsCarousel.jsx` | SNS 피드 자동 로딩 캐러셀 (인스타·유튜브·스레드·블로그) |
| `admin/AdminDashboard.jsx` | 어드민 대시보드 레이아웃 |
| `admin/SnsManager.jsx` | SNS 자동연동 상태 확인 + 수동 항목 관리 |

---

## 🔗 SNS 자동 연동 방식

| SNS | 방식 | 필요 설정 | 특이사항 |
|-----|------|-----------|----------|
| **인스타그램** | Instagram Graph API | `INSTAGRAM_ACCESS_TOKEN` | 토큰 60일마다 갱신 필요 |
| **유튜브** | YouTube Data API v3 | `YOUTUBE_API_KEY` `YOUTUBE_CHANNEL_ID` | Google Cloud 결제 활성화 필요 (무료 한도 내 과금 없음) |
| **스레드** | Threads API | `THREADS_ACCESS_TOKEN` | 토큰 60일마다 갱신 필요 |
| **네이버 블로그** | RSS 파싱 | `NAVER_BLOG_ID` | API 키 불필요, 완전 무료 |

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

# SNS 연동
INSTAGRAM_ACCESS_TOKEN=...
THREADS_ACCESS_TOKEN=...
YOUTUBE_API_KEY=...
YOUTUBE_CHANNEL_ID=UCn8qYoiJBSbzKj6KBBv136Q
NAVER_BLOG_ID=brandhub_official
```

### 프론트엔드 (`frontend/.env`)

```env
VITE_API_URL=https://morningbakery-api-6391c51d5a00.herokuapp.com/api
```

---

## 🛠️ 해결한 주요 문제들

| 문제 | 원인 | 해결 |
|------|------|------|
| SNS 항목 추가 실패 | SNS 라우트가 Heroku에 미배포 상태 | 백엔드 커밋 후 `git push heroku main` |
| 인스타그램 썸네일 깨짐 | 썸네일 URL에 프로필 URL 입력 | 실제 이미지 URL 필요 명시 + Graph API 자동화 |
| 네이버 블로그 썸네일 안 보임 | 네이버 CDN 외부 핫링크 차단 | 백엔드 이미지 프록시 엔드포인트 추가 |
| 네이버 블로그 링크 오작동 | RSS `<link>` CDATA 미처리 | 링크 파싱 정규식에 CDATA 처리 추가 |
| YouTube API key 오류 | Google Cloud 결제 계정 미활성화 | 선불 결제 진행 중 (미완료) |
| Heroku git push 인증 실패 | 터미널 환경 다름 | 동일 터미널에서 `heroku login` 후 push |

---

## 📋 TODO (남은 작업)

### 🔴 긴급
- [ ] **YouTube API 활성화** — Google Cloud 선불 결제 완료 후 적용
- [ ] **Instagram 토큰 갱신 주기 설정** — 60일마다 만료, 자동 갱신 또는 알림 필요
- [ ] **Threads 토큰 갱신 주기 설정** — 동일

### 🟡 중요
- [ ] **Meta 앱 검수 제출** — 현재 개발 모드(테스터만 사용 가능). 실제 고객 계정 연동을 위해 앱 검수 통과 필요
- [ ] **Instagram/Threads 토큰 자동 갱신** — 백엔드에 60일 주기 갱신 엔드포인트 추가
- [ ] **YouTube RSS 폴백** — API 오류 시 RSS 피드로 자동 전환

### 🟢 개선
- [ ] **OG 이미지 추가** — SNS 공유 시 미리보기 이미지
- [ ] **sitemap.xml 생성** — 네이버·구글 SEO
- [ ] **robots.txt 추가**
- [ ] **SNS 토큰 만료 어드민 알림** — 만료 D-7 경고 표시
- [ ] **다중 고객 지원 구조** — 현재는 단일 매장용, 향후 SaaS 형태 확장 고려

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
