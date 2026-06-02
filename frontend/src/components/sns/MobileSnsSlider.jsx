import { useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'

/**
 * 모바일 SNS 섹션 전체 레이아웃
 * - 다크 배경 + 대형 플랫폼 아이콘 + 이름 + 태그라인
 * - 80vw 카드 가로 스크롤 (스냅) — 오른쪽에 다음 카드 피크
 * - 마지막 카드 다음에 '더보기' 카드 → profileUrl 이동
 * - 하단 인디케이터 점
 */
export default function MobileSnsSlider({
  items,
  renderCard,
  profileUrl,
  iconEl,
  name,
  tagline,
  bg = 'bg-zinc-950',
}) {
  const scrollRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const total = items.length + (profileUrl ? 1 : 0)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el || !el.firstElementChild) return
    // 카드 너비(80vw) + gap(16px) = 한 스텝
    const step = el.firstElementChild.offsetWidth + 16
    setActiveIdx(Math.min(Math.round(el.scrollLeft / step), total - 1))
  }

  return (
    <div className={`${bg} flex flex-col min-h-[100svh]`}>

      {/* ── 헤더: 아이콘 + 이름 + 태그라인 ── */}
      <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-[72px] pb-7 px-4 text-center">
        <div className="w-14 h-14 flex items-center justify-center mb-1">
          {iconEl}
        </div>
        <h2 className="text-[22px] font-bold text-white tracking-tight">{name}</h2>
        {tagline && (
          <p className="text-sm text-white/50 leading-relaxed max-w-[260px]">{tagline}</p>
        )}
      </div>

      {/* ── 카드 가로 스크롤 ── */}
      <div className="flex-1 flex flex-col justify-center">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-scroll no-scrollbar"
          style={{
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: '20px',
            WebkitOverflowScrolling: 'touch',
            paddingLeft: '20px',
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{ width: '80vw', scrollSnapAlign: 'start' }}
            >
              {renderCard(item, i)}
            </div>
          ))}

          {/* 더보기 카드 */}
          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex flex-col items-center justify-center gap-3
                         rounded-2xl border border-white/15 bg-white/5 active:bg-white/10
                         transition-colors"
              style={{ width: '80vw', scrollSnapAlign: 'start' }}
            >
              <div className="w-12 h-12 rounded-full border border-white/25 flex items-center justify-center">
                <ChevronRight size={22} strokeWidth={2.5} className="text-white ml-0.5" />
              </div>
              <p className="text-white font-semibold text-[17px]">더보기</p>
              <p className="text-white/40 text-xs">{name} 방문하기</p>
            </a>
          )}

          {/* 우측 끝 여백 (마지막 카드 스냅 후 다음 없음을 암시) */}
          <div className="flex-shrink-0 w-5" aria-hidden="true" />
        </div>
      </div>

      {/* ── 인디케이터 ── */}
      {total > 1 && (
        <div className="flex-shrink-0 flex justify-center gap-1.5 pb-7 pt-4">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/25'
              }`}
            />
          ))}
        </div>
      )}

    </div>
  )
}
