import { useState, useRef, useEffect } from 'react'

/**
 * 데스크탑 크로스페이드 자동 전환 훅
 *
 * @param {object} params
 * @param {Array}  params.items     표시할 항목 배열
 * @param {number} params.visible   동시에 보여줄 슬롯 수 (2 or 3)
 * @param {number} [params.cycleMs] 전환 주기 ms (기본 5000)
 * @param {number} [params.fadeMs]  페이드 지속 ms (기본 1200)
 * @returns {{ slots: Array<{cur:number,next:number,fading:boolean}>, pausedRef, shouldRotate }}
 */
export function useCarouselFade({ items, visible, cycleMs = 5000, fadeMs = 1200 }) {
  const shouldRotate = items.length > visible

  const [slots, setSlots] = useState(() =>
    Array.from({ length: visible }, (_, i) => {
      const idx = items.length > 0 ? Math.min(i, items.length - 1) : 0
      return { cur: idx, next: idx, fading: false }
    })
  )

  const pausedRef = useRef(false)
  const cursorRef = useRef(Math.min(visible, items.length))
  const turnRef   = useRef(0)
  const timerRef  = useRef(null)

  useEffect(() => {
    if (!shouldRotate) return
    cursorRef.current = Math.min(visible, items.length)
    turnRef.current   = 0

    const interval = setInterval(() => {
      if (pausedRef.current) return
      const slotIdx = turnRef.current % visible
      const idx     = cursorRef.current % items.length
      cursorRef.current++
      turnRef.current++

      setSlots(prev =>
        prev.map((s, i) => i === slotIdx ? { ...s, next: idx, fading: true } : s)
      )
      timerRef.current = setTimeout(() => {
        setSlots(prev =>
          prev.map((s, i) => i === slotIdx ? { ...s, cur: idx, fading: false } : s)
        )
      }, fadeMs)
    }, cycleMs)

    return () => { clearInterval(interval); clearTimeout(timerRef.current) }
  }, [shouldRotate, items.length, visible, cycleMs, fadeMs])

  return { slots, pausedRef, shouldRotate }
}
