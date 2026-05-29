import { useEffect, useCallback, useRef } from 'react'

// RAF 기반 컨베이어 벨트 애니메이션 훅.
// trackRef: transform 대상 div의 ref
// pausedRef: 마우스 오버 시 true → 애니메이션 일시 정지
// scrollCard: 화살표 클릭 시 카드 단위 수동 이동
export function useConveyorBelt({ shouldScroll, loopDistance, speed, cardSlot }) {
  const trackRef  = useRef(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const lastTsRef = useRef(null)
  const rafRef    = useRef(null)

  useEffect(() => {
    if (!shouldScroll) return
    const animate = (ts) => {
      if (!pausedRef.current) {
        if (lastTsRef.current != null) {
          const dt = Math.min(ts - lastTsRef.current, 50) // 프레임 드랍 방지
          offsetRef.current = (offsetRef.current + speed * dt / 1000) % loopDistance
          if (trackRef.current) trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`
        }
        lastTsRef.current = ts
      } else {
        lastTsRef.current = null
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [shouldScroll, loopDistance, speed])

  const scrollCard = useCallback((dir) => {
    const cur  = offsetRef.current
    const next = dir > 0
      ? (Math.floor(cur / cardSlot) + 1) * cardSlot
      : (Math.ceil(cur  / cardSlot) - 1) * cardSlot
    offsetRef.current = ((next % loopDistance) + loopDistance) % loopDistance
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`
  }, [loopDistance, cardSlot])

  return { trackRef, pausedRef, scrollCard }
}
