import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const FADE_MS = 380

export default function MobileCardSlider({ items, renderCard }) {
  const [index,  setIndex]  = useState(0)
  const [fading, setFading] = useState(false)
  const busyRef = useRef(false)

  if (!items.length) return null

  const goTo = (next) => {
    if (busyRef.current) return
    busyRef.current = true
    setFading(true)
    setTimeout(() => {
      setIndex(((next % items.length) + items.length) % items.length)
      setFading(false)
      busyRef.current = false
    }, FADE_MS)
  }

  return (
    <div className="relative w-full">
      {/* 카드 — 페이드 인/아웃 */}
      <div
        style={{
          opacity: fading ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease-in-out`,
        }}
      >
        {renderCard(items[index], index)}
      </div>

      {/* 양 사이드 화살표 */}
      {items.length > 1 && (
        <>
          <button
            onClick={() => goTo(index - 1)}
            aria-label="이전"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20
                       w-9 h-9 flex items-center justify-center
                       bg-black/30 hover:bg-black/50 backdrop-blur-sm
                       text-white rounded-full transition-colors duration-200
                       shadow-md"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            aria-label="다음"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20
                       w-9 h-9 flex items-center justify-center
                       bg-black/30 hover:bg-black/50 backdrop-blur-sm
                       text-white rounded-full transition-colors duration-200
                       shadow-md"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* 인디케이터: 10개 이하 → 점, 초과 → 카운터 */}
      {items.length > 1 && (
        <div className="mt-3 flex justify-center">
          {items.length <= 10 ? (
            <div className="flex gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`${i + 1}번 게시물`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? 'w-5 bg-brown-400'
                      : 'w-1.5 bg-brown-600/30'
                  }`}
                />
              ))}
            </div>
          ) : (
            <span className="text-xs text-brown-500 tabular-nums">
              {index + 1} / {items.length}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
