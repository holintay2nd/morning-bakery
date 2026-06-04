import { useState, useEffect, useRef } from 'react'
import { SNS_CONFIG, CARD_GAP } from './config'
import { formatBlogDate } from './utils'
import SectionHeader from './SectionHeader'
import MobileSnsSlider from './MobileSnsSlider'

// 3장: 3×373.33 + 2×16 = 1152px (max-w-6xl 꽉 채움)
const NB_CARD_W   = (1152 - 2 * CARD_GAP) / 3
const NB_CYCLE_MS = 5000
const NB_FADE_MS  = 1200
const NB_VISIBLE  = 3
const NB_THUMB    = Math.round(NB_CARD_W - 28)
const NB_MIN_H    = 14 + 40 + 70 + 14 + NB_THUMB + 14

const config = SNS_CONFIG.find(c => c.key === 'naverBlog')

const NbBigIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full fill-[#03C75A]" aria-hidden="true">
    <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/>
  </svg>
)

function DefaultAvatar() {
  return (
    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-gray-400" aria-hidden="true">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>
  )
}

function NaverBlogPlaceholder() {
  return (
    <div className="w-full aspect-square rounded-xl bg-green-50 flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-14 h-14 opacity-15 fill-[#03C75A]" aria-hidden="true">
        <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/>
      </svg>
    </div>
  )
}

export default function NaverBlogSection({ items, blogTitle, blogUrl, tagline }) {
  const shouldRotate = items.length > NB_VISIBLE

  const [s0Cur,  setS0Cur]  = useState(0)
  const [s0Next, setS0Next] = useState(0)
  const [s0Fade, setS0Fade] = useState(false)

  const [s1Cur,  setS1Cur]  = useState(Math.min(1, items.length - 1))
  const [s1Next, setS1Next] = useState(Math.min(1, items.length - 1))
  const [s1Fade, setS1Fade] = useState(false)

  const [s2Cur,  setS2Cur]  = useState(Math.min(2, items.length - 1))
  const [s2Next, setS2Next] = useState(Math.min(2, items.length - 1))
  const [s2Fade, setS2Fade] = useState(false)

  const pausedRef = useRef(false)
  const cursorRef = useRef(NB_VISIBLE)
  const turnRef   = useRef(0)
  const timerRef  = useRef(null)

  const { bgLight, borderColor } = config

  useEffect(() => {
    if (!shouldRotate) return
    const interval = setInterval(() => {
      if (pausedRef.current) return
      const slot = turnRef.current % NB_VISIBLE
      const idx  = cursorRef.current % items.length
      cursorRef.current++
      turnRef.current++

      if (slot === 0) {
        setS0Next(idx); setS0Fade(true)
        timerRef.current = setTimeout(() => { setS0Cur(idx); setS0Fade(false) }, NB_FADE_MS)
      } else if (slot === 1) {
        setS1Next(idx); setS1Fade(true)
        timerRef.current = setTimeout(() => { setS1Cur(idx); setS1Fade(false) }, NB_FADE_MS)
      } else {
        setS2Next(idx); setS2Fade(true)
        timerRef.current = setTimeout(() => { setS2Cur(idx); setS2Fade(false) }, NB_FADE_MS)
      }
    }, NB_CYCLE_MS)

    return () => { clearInterval(interval); clearTimeout(timerRef.current) }
  }, [shouldRotate, items.length])

  const displayBlogTitle = blogTitle || '네이버 블로그'

  // 데스크탑 카드
  const renderCard = (item) => (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-2xl bg-white border border-gray-200 shadow-sm md:hover:shadow-xl transition-shadow duration-300 block touch-manipulation"
    >
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <DefaultAvatar />
            <span className="text-xs text-gray-600 font-medium truncate">{displayBlogTitle}</span>
          </div>
          {item.timestamp && (
            <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{formatBlogDate(item.timestamp)}</span>
          )}
        </div>
        <p className="text-sm font-bold text-gray-900 line-clamp-1 mb-1.5 leading-snug">{item.title}</p>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">{item.summary || ''}</p>
      </div>
      <div className="px-3.5 pb-3.5">
        {item.thumbnail ? (
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover md:group-hover:scale-105 md:transition-transform md:duration-700" loading="lazy" />
          </div>
        ) : (
          <NaverBlogPlaceholder />
        )}
      </div>
    </a>
  )

  // 모바일 카드 (16:9 썸네일)
  const renderMobileCard = (item, i) => (
    <a
      key={`nb-mob-${item._id ?? i}`}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden touch-manipulation"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {item.thumbnail ? (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      ) : (
        <div className="aspect-video bg-green-50 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-14 h-14 opacity-15 fill-[#03C75A]" aria-hidden="true">
            <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/>
          </svg>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <DefaultAvatar />
            <span className="text-xs text-gray-600 font-medium">{displayBlogTitle}</span>
          </div>
          {item.timestamp && <span className="text-[11px] text-gray-400">{formatBlogDate(item.timestamp)}</span>}
        </div>
        <p className="text-base font-bold text-gray-900 mb-1.5 leading-snug line-clamp-2">{item.title}</p>
        <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{item.summary || ''}</p>
      </div>
    </a>
  )

  // 데스크탑 크로스페이드 슬롯
  const renderSlot = (curIdx, nextIdx, isFading, key) => (
    <div key={key} className="relative" style={{ width: NB_CARD_W, flexShrink: 0, minHeight: NB_MIN_H }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: isFading ? 1 : 0, transition: isFading ? `opacity ${NB_FADE_MS}ms ease-in-out` : 'none' }}>
        {renderCard(items[nextIdx])}
      </div>
      <div style={{ position: 'relative', zIndex: 2, opacity: isFading ? 0 : 1, transition: isFading ? `opacity ${NB_FADE_MS}ms ease-in-out` : 'none' }}>
        {renderCard(items[curIdx])}
      </div>
    </div>
  )

  if (items.length === 0) {
    return (
      <div id="sns-naverblog" className="md:mb-14 scroll-mt-24">
        <div className="md:hidden">
          <MobileSnsSlider items={[]} renderCard={() => null} profileUrl={blogUrl} iconEl={<NbBigIcon />} name={displayBlogTitle} tagline={tagline} />
        </div>
        <div className="hidden md:block">
          <SectionHeader config={config} profileUrl={blogUrl} tagline={tagline} />
          <div className={`${bgLight} border ${borderColor} rounded-2xl py-10 text-center`}>
            <p className="text-brown-300 text-sm">등록된 포스트가 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="sns-naverblog" className="md:mb-14 scroll-mt-24">

      {/* ── 모바일: 피크 스와이프 슬라이더 ── */}
      <div className="md:hidden">
        <MobileSnsSlider
          items={items}
          renderCard={renderMobileCard}
          profileUrl={blogUrl}
          iconEl={<NbBigIcon />}
          name={displayBlogTitle}
          tagline={tagline}
        />
      </div>

      {/* ── 데스크탑: 크로스페이드 자동 전환 ── */}
      <div className="hidden md:block">
        <SectionHeader config={config} profileUrl={blogUrl} tagline={tagline} />
        <div
          className="flex pb-6"
          style={{ gap: `${CARD_GAP}px` }}
          onMouseEnter={() => { pausedRef.current = true  }}
          onMouseLeave={() => { pausedRef.current = false }}
        >
          {shouldRotate ? (
            <>
              {renderSlot(s0Cur, s0Next, s0Fade, 'nb-0')}
              {renderSlot(s1Cur, s1Next, s1Fade, 'nb-1')}
              {renderSlot(s2Cur, s2Next, s2Fade, 'nb-2')}
            </>
          ) : (
            items.map((item, i) => (
              <div key={`nb-static-${i}`} style={{ width: NB_CARD_W, flexShrink: 0, minHeight: NB_MIN_H }}>
                {renderCard(item)}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}
