import { useState, useRef } from 'react'

const FADE_MS        = 380
const SWIPE_MIN_PX   = 40   // 스와이프로 인식할 최소 이동 거리

export default function MobileCardSlider({ items, renderCard }) {
  const [index,  setIndex]  = useState(0)
  const [fading, setFading] = useState(false)
  const busyRef       = useRef(false)
  const touchStartX   = useRef(null)

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

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < SWIPE_MIN_PX) return
    goTo(dx < 0 ? index + 1 : index - 1)
  }

  return (
    <div
      className="relative w-full"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 카드 — 페이드 인/아웃 */}
      <div style={{ opacity: fading ? 0 : 1, transition: `opacity ${FADE_MS}ms ease-in-out` }}>
        {renderCard(items[index], index)}
      </div>

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
                    i === index ? 'w-5 bg-brown-400' : 'w-1.5 bg-brown-600/30'
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
