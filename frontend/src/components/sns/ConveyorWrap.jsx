import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CARD_GAP } from './config'

// alignStart: true → align-items: flex-start (카드 높이가 콘텐츠에 맞게 auto)
// centered:   true → justify-content: center (정적 카드가 3장 미만일 때)
export default function ConveyorWrap({
  shouldScroll,
  trackRef,
  pausedRef,
  scrollCard,
  centered  = false,
  alignStart = false,
  children,
}) {
  const trackStyle = {
    gap: `${CARD_GAP}px`,
    ...(alignStart && { alignItems: 'flex-start' }),
  }

  return (
    <div className="relative">
      {/* 양 사이드 오버레이 화살표 */}
      {shouldScroll && (
        <>
          <button
            onClick={() => scrollCard(-1)}
            aria-label="이전"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20
                       w-9 h-9 flex items-center justify-center
                       bg-white/80 hover:bg-white backdrop-blur-sm
                       text-brown-500 hover:text-brown-900
                       rounded-full shadow-md border border-gray-100
                       transition-all duration-200"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <button
            onClick={() => scrollCard(1)}
            aria-label="다음"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20
                       w-9 h-9 flex items-center justify-center
                       bg-white/80 hover:bg-white backdrop-blur-sm
                       text-brown-500 hover:text-brown-900
                       rounded-full shadow-md border border-gray-100
                       transition-all duration-200"
          >
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </>
      )}
      <div
        className="overflow-hidden pb-6"
        onMouseEnter={shouldScroll ? () => { pausedRef.current = true  } : undefined}
        onMouseLeave={shouldScroll ? () => { pausedRef.current = false } : undefined}
      >
        {shouldScroll ? (
          <div ref={trackRef} className="flex" style={trackStyle}>
            {children}
          </div>
        ) : (
          <div className={centered ? 'flex justify-center' : 'flex'} style={trackStyle}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
