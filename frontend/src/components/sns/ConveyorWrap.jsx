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
      {shouldScroll && (
        <>
          <button
            onClick={() => scrollCard(-1)}
            aria-label="이전"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 text-gray-300 hover:text-gray-600 transition-colors duration-200"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => scrollCard(1)}
            aria-label="다음"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 text-gray-300 hover:text-gray-600 transition-colors duration-200"
          >
            <ChevronRight size={28} strokeWidth={1.5} />
          </button>
        </>
      )}
      <div
        className="overflow-hidden py-4"
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
