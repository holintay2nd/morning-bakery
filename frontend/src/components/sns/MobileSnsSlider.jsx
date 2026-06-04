import { useRef, useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'

/**
 * 모바일 SNS 섹션 전체 레이아웃
 *
 * 레이아웃:
 *   [헤더: 아이콘+워드마크(profileUrl 클릭 → SNS 이동) → 태그라인]
 *   [flex-1 justify-center]
 *     [프로필 행: [avatar + name]  ←→  [mediaLabel N  followersLabel N]]
 *     [카드 가로 스크롤]
 *   [인디케이터 점]
 *
 * profileInfo 필드:
 *   picture, username, namePrefix('@'|''), mediaCount, followersCount,
 *   mediaLabel('게시물'|'동영상'|...), followersLabel('팔로워'|'구독자'|'이웃'|...)
 *
 * 스케일: onScroll → rAF → DOM style 직접 조작 (React 리렌더 0회)
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
  bg       = 'bg-white',
  isDark   = false,
  iconSize = 'w-9 h-9',
}) {
  const scrollRef = useRef(null)
  const innerRefs = useRef([])
  const rafRef    = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const total      = items.length + (profileUrl ? 1 : 0)
  const hasProfile = !!profileInfo?.username

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

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  const handleScroll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const el = scrollRef.current
      if (!el || items.length === 0 || !el.firstElementChild) return
      const step = el.firstElementChild.offsetWidth + 12
      const raw  = el.scrollLeft / step

      innerRefs.current.forEach((ref, i) => {
        if (!ref) return
        const offset = Math.abs(i - raw)
        const scale  = offset >= 1 ? 0.88 : 1 - 0.12 * offset
        const diff   = i - raw
        const origin = Math.abs(diff) < 0.02 ? 'center center'
                     : diff < 0             ? 'right center'
                     :                        'left center'
        ref.style.transform       = `scale(${scale})`
        ref.style.transformOrigin = origin
      })

      const newIdx = Math.min(Math.round(raw), total - 1)
      setActiveIdx(prev => (prev !== newIdx ? newIdx : prev))
    })
  }

  // 아이콘+워드마크 공통 내용
  const headerIconWordmark = (
    <>
      <div className={`${iconSize} flex items-center justify-center`}>
        {iconEl}
      </div>
      <div>
        {wordmarkEl ?? <h2 className={`text-[22px] font-bold tracking-tight ${t.title}`}>{name}</h2>}
      </div>
    </>
  )

  return (
    <div className={`${bg} flex flex-col min-h-[100svh]`}>

      {/* ── 중앙 정렬 헤더 ── */}
      <div className="flex-shrink-0 flex flex-col items-center pt-12 pb-4 px-4 text-center gap-2">
        {/* 아이콘 + 워드마크: profileUrl 있으면 클릭 → SNS 이동 */}
        {profileUrl ? (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center active:opacity-70 transition-opacity gap-2"
          >
            {headerIconWordmark}
          </a>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {headerIconWordmark}
          </div>
        )}
        {/* 태그라인: 항상 워드마크 아래 */}
        {tagline && (
          <p className={`text-sm leading-relaxed max-w-[260px] ${t.sub}`}>{tagline}</p>
        )}
      </div>

      {/* ── 프로필 행 + 카드: 함께 수직 중앙 정렬 ── */}
      <div className="flex-1 flex flex-col justify-center">

        {/* 프로필 행: 카드 바로 위, 카드 좌우 경계에 맞춤 */}
        {hasProfile && (
          <div className="flex-shrink-0 flex items-center px-[10.5vw] pb-2">
            {/* 왼쪽: 아바타 + 이름 */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {profileInfo.picture ? (
                <img
                  src={profileInfo.picture}
                  alt={profileInfo.username}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
              )}
              <p className={`text-sm font-bold truncate ${t.title}`}>
                {profileInfo.namePrefix ?? '@'}{profileInfo.username}
              </p>
            </div>
            {/* 오른쪽: 통계 */}
            {(profileInfo.mediaCount != null || profileInfo.followersCount != null) && (
              <div className={`flex gap-3 text-xs flex-shrink-0 ${t.sub}`}>
                {profileInfo.mediaCount != null && (
                  <span>
                    {profileInfo.mediaLabel ?? '게시물'}{' '}
                    <strong className={t.title}>{profileInfo.mediaCount.toLocaleString()}</strong>
                  </span>
                )}
                {profileInfo.followersCount != null && (
                  <span>
                    {profileInfo.followersLabel ?? '팔로워'}{' '}
                    <strong className={t.title}>{profileInfo.followersCount.toLocaleString()}</strong>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* 카드 가로 스크롤 */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-shrink-0 flex items-center gap-3 overflow-x-scroll no-scrollbar"
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
              <div
                ref={el => { innerRefs.current[i] = el }}
                style={{
                  transform:       i === 0 ? 'scale(1)'      : 'scale(0.88)',
                  transformOrigin: i === 0 ? 'center center' : 'left center',
                }}
              >
                {renderCard(item, i)}
              </div>
            </div>
          ))}

          {/* 더보기 카드 */}
          {profileUrl && (
            <div
              className="flex-shrink-0"
              style={{ width: '79vw', scrollSnapAlign: 'start', alignSelf: 'stretch' }}
            >
              <div
                className="h-full"
                ref={el => { innerRefs.current[items.length] = el }}
                style={{ transform: 'scale(0.88)', transformOrigin: 'left center' }}
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
