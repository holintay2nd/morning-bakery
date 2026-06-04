import { useState, useEffect, useRef } from 'react'
import { SNS_CONFIG, CARD_GAP } from './config'
import { formatRelativeDate } from './utils'
import SectionHeader from './SectionHeader'
import MobileSnsSlider from './MobileSnsSlider'

// 3장: 3×373.33 + 2×16 = 1152px (max-w-6xl 꽉 채움)
const TH_CARD_W   = (1152 - 2 * CARD_GAP) / 3
const TH_CYCLE_MS = 5000
const TH_FADE_MS  = 1200
const TH_VISIBLE  = 3

const TH_MIN_CARD_H = Math.ceil(54 + 58 + (TH_CARD_W - 28) * 0.75 + 14)
const GRID_COLS = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' }

const config = SNS_CONFIG.find(c => c.key === 'threads')

const ThreadsIcon = () => (
  <img src="/threads_logo_black.svg" alt="Threads" className="w-full h-full object-contain" draggable={false} />
)
const ThreadsWordmark = () => (
  <img src="/threads_wordmark_black.png" alt="Threads" className="h-7 w-auto object-contain" draggable={false} />
)

export default function ThreadsSection({ items, username, profilePicture, tagline, followersCount, mediaCount }) {
  const [avatarError, setAvatarError] = useState(false)

  const shouldRotate = items.length > TH_VISIBLE

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
  const cursorRef = useRef(TH_VISIBLE)
  const turnRef   = useRef(0)
  const timerRef  = useRef(null)

  const { bgLight, borderColor } = config

  useEffect(() => {
    if (!shouldRotate) return
    const interval = setInterval(() => {
      if (pausedRef.current) return
      const slot = turnRef.current % TH_VISIBLE
      const idx  = cursorRef.current % items.length
      cursorRef.current++
      turnRef.current++

      if (slot === 0) {
        setS0Next(idx); setS0Fade(true)
        timerRef.current = setTimeout(() => { setS0Cur(idx); setS0Fade(false) }, TH_FADE_MS)
      } else if (slot === 1) {
        setS1Next(idx); setS1Fade(true)
        timerRef.current = setTimeout(() => { setS1Cur(idx); setS1Fade(false) }, TH_FADE_MS)
      } else {
        setS2Next(idx); setS2Fade(true)
        timerRef.current = setTimeout(() => { setS2Cur(idx); setS2Fade(false) }, TH_FADE_MS)
      }
    }, TH_CYCLE_MS)

    return () => { clearInterval(interval); clearTimeout(timerRef.current) }
  }, [shouldRotate, items.length])

  const showAvatar      = !!(profilePicture && !avatarError)
  const displayUsername = username || 'threads'

  // 공통 카드 렌더
  const renderCard = (item) => {
    const images   = item.images?.length > 0 ? item.images : (item.thumbnail ? [item.thumbnail] : [])
    const gridCols = GRID_COLS[Math.min(images.length, 3)] ?? 'grid-cols-3'
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group bg-white rounded-2xl border border-gray-200 shadow-sm md:hover:shadow-xl transition-shadow duration-300 block touch-manipulation"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div className="flex items-center gap-2.5 px-3.5 pt-3.5 pb-2">
          {showAvatar ? (
            <img src={profilePicture} alt={displayUsername} className="w-8 h-8 rounded-full object-cover flex-shrink-0" onError={() => setAvatarError(true)} />
          ) : (
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 p-1.5">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-white" aria-hidden="true">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z"/>
              </svg>
            </div>
          )}
          <span className="text-sm font-bold text-gray-900 truncate">{displayUsername}</span>
          {item.timestamp && <span className="text-xs text-gray-400 flex-shrink-0">{formatRelativeDate(item.timestamp)}</span>}
        </div>
        <p className={`px-3.5 pb-3 text-sm text-gray-800 leading-relaxed whitespace-pre-line ${images.length > 0 ? 'line-clamp-2' : 'line-clamp-[12]'}`}>
          {item.text || ''}
        </p>
        {images.length > 0 && (
          <div className={`px-3.5 pb-3.5 grid gap-1.5 ${gridCols}`}>
            {images.map((src, idx) => (
              <div key={idx} className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                <img src={src} alt="" className="w-full h-full object-cover md:group-hover:scale-105 md:transition-transform md:duration-700" loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </a>
    )
  }

  // 모바일 카드 (key 포함)
  const renderMobileCard = (item, i) => (
    <div key={`th-mob-${item._id ?? i}`}>
      {renderCard(item)}
    </div>
  )

  // 데스크탑 크로스페이드 슬롯
  const renderSlot = (curIdx, nextIdx, isFading, key) => (
    <div key={key} className="relative" style={{ width: TH_CARD_W, flexShrink: 0, minHeight: TH_MIN_CARD_H }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: isFading ? 1 : 0, transition: isFading ? `opacity ${TH_FADE_MS}ms ease-in-out` : 'none' }}>
        {renderCard(items[nextIdx])}
      </div>
      <div style={{ position: 'relative', zIndex: 2, opacity: isFading ? 0 : 1, transition: isFading ? `opacity ${TH_FADE_MS}ms ease-in-out` : 'none' }}>
        {renderCard(items[curIdx])}
      </div>
    </div>
  )

  const profileUrl = username ? `https://www.threads.net/@${username}` : null

  if (items.length === 0) {
    return (
      <div id="sns-threads" className="md:mb-14 scroll-mt-24">
        <div className="md:hidden">
          <MobileSnsSlider
            items={[]}
            renderCard={() => null}
            profileUrl={profileUrl}
            iconEl={<ThreadsIcon />}
            wordmarkEl={<ThreadsWordmark />}
            name="Threads"
            tagline={tagline}
            profileInfo={profileUrl ? {
              picture:        profilePicture || null,
              username:       displayUsername,
              namePrefix:     '@',
              mediaCount:     mediaCount     ?? null,
              followersCount: followersCount ?? null,
              mediaLabel:     '게시물',
              followersLabel: '팔로워',
            } : null}
          />
        </div>
        <div className="hidden md:block">
          <SectionHeader config={config} profileUrl={profileUrl} tagline={tagline} />
          <div className={`${bgLight} border ${borderColor} rounded-2xl py-10 text-center`}>
            <p className="text-brown-300 text-sm">등록된 게시물이 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="sns-threads" className="md:mb-14 scroll-mt-24">

      {/* ── 모바일: 피크 스와이프 슬라이더 ── */}
      <div className="md:hidden">
        <MobileSnsSlider
          items={items}
          renderCard={renderMobileCard}
          profileUrl={profileUrl}
          iconEl={<ThreadsIcon />}
          wordmarkEl={<ThreadsWordmark />}
          name="Threads"
          tagline={tagline}
          profileInfo={profileUrl ? {
            picture:        profilePicture || null,
            username:       displayUsername,
            namePrefix:     '@',
            mediaCount:     null,
            followersCount: null,
            mediaLabel:     '게시물',
            followersLabel: '팔로워',
          } : null}
        />
      </div>

      {/* ── 데스크탑: 크로스페이드 자동 전환 ── */}
      <div className="hidden md:block">
        <SectionHeader
          config={config}
          profileUrl={profileUrl}
          tagline={tagline}
        />
        <div
          className="flex pb-6"
          style={{ gap: `${CARD_GAP}px` }}
          onMouseEnter={() => { pausedRef.current = true  }}
          onMouseLeave={() => { pausedRef.current = false }}
        >
          {shouldRotate ? (
            <>
              {renderSlot(s0Cur, s0Next, s0Fade, 'th-0')}
              {renderSlot(s1Cur, s1Next, s1Fade, 'th-1')}
              {renderSlot(s2Cur, s2Next, s2Fade, 'th-2')}
            </>
          ) : (
            items.map((item, i) => (
              <div key={`th-static-${i}`} style={{ width: TH_CARD_W, flexShrink: 0, minHeight: TH_MIN_CARD_H }}>
                {renderCard(item)}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}
