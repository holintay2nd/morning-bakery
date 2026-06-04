import { useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'

/**
 * 모바일 SNS 섹션 전체 레이아웃
 * - 중앙 정렬 헤더: 아이콘 → 워드마크/이름 → 태그라인(profileInfo 없을 때)
 * - 좌측 정렬 프로필 (profileInfo 있을 때): ID / 통계 / 태그라인
 * - 79vw 카드 가로 스크롤 (스냅) — 좌우 10.5vw, paddingRight 대신 spacer div
 * - 스케일: activeIdx 정수 기반 + CSS transition 700ms ease-out
 * - 더보기 카드 → profileUrl 이동
 * - 하단 인디케이터 점
 */
export default function MobileSnsSlider({
  items,
  renderCard,
  profileUrl,
  iconEl,
  name,
  wordmarkEl,
  tagline,
  profileInfo,  // { picture, username, mediaCount, followersCount }
  bg     = 'bg-white',
  isDark = false,
}) {
  const scrollRef = useRef(null)
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

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el || !el.firstElementChild) return
    const step = el.firstElementChild.offsetWidth + 12
    setActiveIdx(Math.min(Math.round(el.scrollLeft / step), total - 1))
  }

  const getOrigin = (i) =>
    i === activeIdx ? 'center center'
    : i < activeIdx ? 'right center'
    :                 'left center'

  return (
    <div className={`${bg} flex flex-col min-h-[100svh]`}>

      {/* ── 중앙 정렬 헤더 ── */}
      <div className="flex-shrink-0 flex flex-col items-center pt-12 pb-4 px-4 text-center">
        <div className="w-9 h-9 flex items-center justify-center mb-2">
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
        <div className="flex-shrink-0 px-[10.5vw] pt-1">
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
            // paddingRight 대신 하단의 spacer div로 처리 — iOS WebKit 패딩 버그 방지
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{ width: '79vw', scrollSnapAlign: 'start' }}
            >
              <div
                style={{
                  transform:       i === activeIdx ? 'scale(1)' : 'scale(0.88)',
                  transformOrigin: getOrigin(i),
                  transition:      'transform 700ms ease-out',
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
                style={{
                  transform:       activeIdx === items.length ? 'scale(1)' : 'scale(0.88)',
                  transformOrigin: 'center center',
                  transition:      'transform 700ms ease-out',
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

          {/* paddingRight 대체 spacer — iOS WebKit에서 padding-right 무시 버그 방지 */}
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
