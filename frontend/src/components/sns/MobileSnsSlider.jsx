import { useRef, useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'

/**
 * 모바일 SNS 섹션 전체 레이아웃
 *
 * ── 스케일 전환 방식 ──
 * onScroll → rAF → DOM style 직접 조작 (React state 업데이트 없음)
 *   → 리렌더 없이 60fps 실시간 보간: scale = 1 - 0.12 × |i - scrollProgress|
 *   → 팍 튀는 현상 없음, 버벅임 없음
 * React state(activeIdx)는 인디케이터 점 전환에만 사용
 *
 * ── peek 균형 ──
 * 모든 비활성 카드: transformOrigin = diff<0 ? 'right center' : 'left center'
 *   → 뷰포트 경계 쪽 끝을 고정 → 좌/우 peek 동일
 * (이전 버그: 더보기 카드에 'center center' 적용 → 왼쪽 끝이 안쪽으로 밀려 peek 절반)
 */
export default function MobileSnsSlider({
  items,
  renderCard,
  profileUrl,
  iconEl,
  name,
  wordmarkEl,
  tagline,
  profileInfo,
  bg     = 'bg-white',
  isDark = false,
}) {
  const scrollRef  = useRef(null)
  const innerRefs  = useRef([])   // 스케일 div refs — DOM 직접 조작용
  const rafRef     = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const total      = items.length + (profileUrl ? 1 : 0)
  const hasProfile = !!profileInfo?.username

  // 테마 토큰
  const t = isDark ? {
    title:     'text-white',
    sub:       'text-white/50',
    dotOn:     'bg-white',
    dotOff:    'bg-white/25',
    moreBg:    'border-white/15 bg-white/5',
    moreIcon:  'border-white/25',
    moreTitle: 'text-white',
    moreSub:   'text-white/40',
    chevron:   'text-white',
  } : {
    title:     'text-gray-900',
    sub:       'text-gray-400',
    dotOn:     'bg-gray-600',
    dotOff:    'bg-gray-200',
    moreBg:    'border-gray-200 bg-gray-50',
    moreIcon:  'border-gray-300',
    moreTitle: 'text-gray-800',
    moreSub:   'text-gray-400',
    chevron:   'text-gray-700',
  }

  // RAF 정리
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  // ── 스크롤 핸들러: React state 없이 DOM style 직접 업데이트 ──
  const handleScroll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const el = scrollRef.current
      if (!el || items.length === 0 || !el.firstElementChild) return
      const step = el.firstElementChild.offsetWidth + 12  // cardWidth + gap
      const raw  = el.scrollLeft / step

      innerRefs.current.forEach((ref, i) => {
        if (!ref) return
        const offset = Math.abs(i - raw)
        const scale  = offset >= 1 ? 0.88 : 1 - 0.12 * offset
        const diff   = i - raw
        // 뷰포트 경계 쪽 끝을 origin으로 고정 → peek 균형
        const origin = Math.abs(diff) < 0.02 ? 'center center'
                     : diff < 0             ? 'right center'
                     :                        'left center'
        ref.style.transform       = `scale(${scale})`
        ref.style.transformOrigin = origin
      })

      // 인디케이터 도트용 최소 리렌더 (값 변경 시에만)
      const newIdx = Math.min(Math.round(raw), total - 1)
      setActiveIdx(prev => (prev !== newIdx ? newIdx : prev))
    })
  }

  return (
    <div className={`${bg} flex flex-col min-h-[100svh]`}>

      {/* ── 중앙 정렬 헤더 ── */}
      <div className="flex-shrink-0 flex flex-col items-center pt-12 pb-4 px-4 text-center">
        <div className="w-9 h-9 flex items-center justify-center mb-1">
          {iconEl}
        </div>
        <div className="mb-2">
          {wordmarkEl ?? <h2 className={`text-[22px] font-bold tracking-tight ${t.title}`}>{name}</h2>}
        </div>
        {!hasProfile && tagline && (
          <p className={`text-sm leading-relaxed max-w-[260px] ${t.sub}`}>{tagline}</p>
        )}
      </div>

      {/* ── 프로필 (좌측 정렬, 카드 좌변 기준) ── */}
      {hasProfile && (
        <div className="flex-shrink-0 flex justify-center pt-1 px-4">
          <div className="flex items-center gap-3">
            {profileInfo.picture ? (
              <img
                src={profileInfo.picture}
                alt={profileInfo.username}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-100 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className={`font-bold text-sm ${t.title}`}>@{profileInfo.username}</p>
              {(profileInfo.mediaCount != null || profileInfo.followersCount != null) && (
                <div className={`flex gap-4 mt-0.5 text-xs ${t.sub}`}>
                  {profileInfo.mediaCount != null && (
                    <span>게시물 <strong className={t.title}>{profileInfo.mediaCount.toLocaleString()}</strong></span>
                  )}
                  {profileInfo.followersCount != null && (
                    <span>팔로워 <strong className={t.title}>{profileInfo.followersCount.toLocaleString()}</strong></span>
                  )}
                </div>
              )}
              {tagline && (
                <p className={`text-xs mt-0.5 leading-relaxed ${t.sub}`}>{tagline}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 카드 가로 스크롤 ── */}
      <div
        className="flex-1 flex flex-col"
        style={{
          justifyContent: hasProfile ? 'flex-start' : 'center',
          paddingTop:     hasProfile ? '5vw'        : 0,
        }}
      >
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-center gap-3 overflow-x-scroll no-scrollbar"
          style={{
            scrollSnapType:          'x mandatory',
            scrollPaddingLeft:       '10.5vw',
            WebkitOverflowScrolling: 'touch',
            paddingLeft:             '10.5vw',
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{ width: '79vw', scrollSnapAlign: 'start' }}
            >
              {/* 초기 스타일: activeIdx=0 → card0은 scale(1), 나머지 scale(0.88) */}
              <div
                ref={el => { innerRefs.current[i] = el }}
                style={{
                  transform:       i === 0 ? 'scale(1)'    : 'scale(0.88)',
                  transformOrigin: i === 0 ? 'center center' : 'left center',
                }}
              >
                {renderCard(item, i)}
              </div>
            </div>
          ))}

          {/* 더보기 카드 — origin: left center (비활성 시 왼쪽 끝 고정) */}
          {profileUrl && (
            <div
              className="flex-shrink-0"
              style={{ width: '79vw', scrollSnapAlign: 'start', alignSelf: 'stretch' }}
            >
              <div
                className="h-full"
                ref={el => { innerRefs.current[items.length] = el }}
                style={{
                  transform:       'scale(0.88)',
                  transformOrigin: 'left center',
                }}
              >
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`h-full flex flex-col items-center justify-center gap-3
                              rounded-2xl border active:opacity-70 transition-opacity ${t.moreBg}`}
                >
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${t.moreIcon}`}>
                    <ChevronRight size={20} strokeWidth={2.5} className={`${t.chevron} ml-0.5`} />
                  </div>
                  <p className={`font-semibold text-[17px] ${t.moreTitle}`}>더보기</p>
                  <p className={`text-xs ${t.moreSub}`}>{name} 방문하기</p>
                </a>
              </div>
            </div>
          )}

          {/* paddingRight 대체 spacer — iOS WebKit padding-right 무시 버그 방지 */}
          <div style={{ width: '10.5vw', flexShrink: 0 }} aria-hidden="true" />
        </div>
      </div>

      {/* ── 인디케이터 ── */}
      {total > 1 && (
        <div className="flex-shrink-0 flex justify-center gap-1.5 pb-20 pt-4">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIdx ? `w-4 ${t.dotOn}` : `w-1.5 ${t.dotOff}`
              }`}
            />
          ))}
        </div>
      )}

    </div>
  )
}
