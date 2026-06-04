import { useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'

/**
 * 모바일 SNS 섹션 전체 레이아웃
 * - 플랫폼 아이콘 + 이름 + 태그라인 헤더
 * - 78vw 카드 가로 스크롤 (스냅) — 좌우 균등 11vw 피크
 * - 마지막 카드 다음에 '더보기' 카드 → profileUrl 이동
 * - 하단 인디케이터 점
 *
 * isDark=false (기본) : 화이트 배경, 다크 텍스트
 * isDark=true         : 다크 배경, 흰 텍스트
 */
export default function MobileSnsSlider({
  items,
  renderCard,
  profileUrl,
  iconEl,
  name,
  wordmarkEl,   // 플랫폼 워드마크 SVG/JSX — 제공 시 name 텍스트 대신 렌더링
  tagline,
  profileInfo,  // { picture, username, bio, mediaCount, followersCount, followsCount }
  bg     = 'bg-white',
  isDark = false,
}) {
  const scrollRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const total = items.length + (profileUrl ? 1 : 0)

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
    // 86vw 카드 + gap-3(12px) = 한 스텝
    const step = el.firstElementChild.offsetWidth + 12
    setActiveIdx(Math.min(Math.round(el.scrollLeft / step), total - 1))
  }

  return (
    <div className={`${bg} flex flex-col min-h-[100svh]`}>

      {/* ── 헤더: 아이콘 + 이름/워드마크 + 태그라인 + 프로필 정보 ── */}
      <div className={`flex-shrink-0 flex flex-col items-center gap-2 ${profileInfo ? 'pt-10' : 'pt-12'} pb-6 px-4 text-center`}>
        <div className="w-9 h-9 flex items-center justify-center mb-1">
          {iconEl}
        </div>
        {wordmarkEl ?? <h2 className={`text-[22px] font-bold tracking-tight ${t.title}`}>{name}</h2>}
        {tagline && (
          <p className={`text-sm leading-relaxed max-w-[260px] ${t.sub}`}>{tagline}</p>
        )}
        {/* SNS 프로필 정보 (Instagram 등 지원 플랫폼) */}
        {profileInfo?.username && (
          <div className="mt-2 w-full max-w-[300px]">
            <div className="flex items-center gap-3 text-left">
              {profileInfo.picture ? (
                <img
                  src={profileInfo.picture}
                  alt={profileInfo.username}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-100 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm truncate ${t.title}`}>@{profileInfo.username}</p>
                <div className={`flex gap-3 mt-1 text-xs ${t.sub}`}>
                  {profileInfo.mediaCount     != null && <span><strong className={t.title}>{profileInfo.mediaCount.toLocaleString()}</strong> 게시물</span>}
                  {profileInfo.followersCount != null && <span><strong className={t.title}>{profileInfo.followersCount.toLocaleString()}</strong> 팔로워</span>}
                  {profileInfo.followsCount   != null && <span><strong className={t.title}>{profileInfo.followsCount.toLocaleString()}</strong> 팔로우</span>}
                </div>
                {profileInfo.bio && (
                  <p className={`text-xs mt-1 line-clamp-2 ${t.sub}`}>{profileInfo.bio}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 카드 가로 스크롤: 좌우 11vw 균등 패딩으로 가운데 정렬 ── */}
      <div className="flex-1 flex flex-col justify-center">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-center gap-3 overflow-x-scroll no-scrollbar"
          style={{
            scrollSnapType:    'x mandatory',
            scrollPaddingLeft: '7vw',
            WebkitOverflowScrolling: 'touch',
            paddingLeft:  '7vw',
            paddingRight: '7vw',
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{ width: '86vw', scrollSnapAlign: 'start' }}
            >
              <div
                className="transition-transform duration-300 ease-out"
                style={{
                  transform: i === activeIdx ? 'scale(1)' : 'scale(0.82)',
                  transformOrigin: 'center center',
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
              style={{ width: '78vw', scrollSnapAlign: 'start', alignSelf: 'stretch' }}
            >
              <div
                className="h-full transition-transform duration-300 ease-out"
                style={{
                  transform: activeIdx === items.length ? 'scale(1)' : 'scale(0.82)',
                  transformOrigin: 'center center',
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
