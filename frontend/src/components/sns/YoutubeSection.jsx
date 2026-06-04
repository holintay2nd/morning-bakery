import { useState, useEffect, useRef } from 'react'
import { SNS_CONFIG, CARD_GAP } from './config'
import { formatRelativeDate, formatViewCount } from './utils'
import SectionHeader from './SectionHeader'
import MobileSnsSlider from './MobileSnsSlider'

// 2장: 2×568 + 16 = 1152px (max-w-6xl)
const YT_CARD_W   = 568
const YT_CYCLE_MS = 5000
const YT_FADE_MS  = 1200

const config = SNS_CONFIG.find(c => c.key === 'youtube')

const YoutubeIcon = () => (
  <img src="/youtube_icon_red.png" alt="YouTube" className="w-full h-full object-contain" draggable={false} />
)
const YoutubeWordmark = () => (
  <img src="/youtube_wordmark_black.png" alt="YouTube" className="h-8 w-auto object-contain" draggable={false} />
)

export default function YoutubeSection({ items, channelName, channelAvatar, channelUrl, tagline, subscriberCount, videoCount }) {
  const [avatarError, setAvatarError] = useState(false)

  const [leftCur,  setLeftCur]  = useState(0)
  const [leftNext, setLeftNext] = useState(0)
  const [leftFade, setLeftFade] = useState(false)

  const [rightCur,  setRightCur]  = useState(Math.min(1, items.length - 1))
  const [rightNext, setRightNext] = useState(Math.min(1, items.length - 1))
  const [rightFade, setRightFade] = useState(false)

  const pausedRef    = useRef(false)
  const cursorRef    = useRef(Math.min(2, items.length))
  const turnRef      = useRef(0)
  const fadeTimerRef = useRef(null)

  const { bgLight, borderColor, color } = config

  useEffect(() => {
    if (items.length <= 2) return
    const cycle = setInterval(() => {
      if (pausedRef.current) return
      const idx = cursorRef.current % items.length
      cursorRef.current++
      if (turnRef.current === 0) {
        setLeftNext(idx)
        setLeftFade(true)
        fadeTimerRef.current = setTimeout(() => { setLeftCur(idx); setLeftFade(false) }, YT_FADE_MS)
        turnRef.current = 1
      } else {
        setRightNext(idx)
        setRightFade(true)
        fadeTimerRef.current = setTimeout(() => { setRightCur(idx); setRightFade(false) }, YT_FADE_MS)
        turnRef.current = 0
      }
    }, YT_CYCLE_MS)
    return () => { clearInterval(cycle); clearTimeout(fadeTimerRef.current) }
  }, [items.length])

  const showAvatar     = !!(channelAvatar && !avatarError)
  const displayChannel = channelName || 'YouTube'

  // 공통 카드 내용
  const renderCardInner = (item) => (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white shadow-sm md:hover:shadow-xl transition-shadow duration-300 block rounded-2xl touch-manipulation"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className={`relative ${item.isShort ? 'aspect-[3/4]' : 'aspect-video'} overflow-hidden bg-gray-200 rounded-t-2xl`}>
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover md:group-hover:scale-105 md:transition-transform md:duration-700"
          loading="lazy"
          onError={e => { e.target.src = `https://i.ytimg.com/vi/${item._id}/hqdefault.jpg` }}
        />
      </div>
      <div className="p-4 flex gap-3 items-start">
        <div className="flex-shrink-0 mt-0.5">
          {showAvatar ? (
            <img src={channelAvatar} alt={displayChannel} className="w-9 h-9 rounded-full object-cover" onError={() => setAvatarError(true)} />
          ) : (
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center p-2`}>
              <svg viewBox="0 0 24 24" className="w-full h-full fill-white" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-brown-800 text-sm font-semibold line-clamp-2 leading-snug mb-1">{item.title}</p>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-brown-400 text-xs">
            <span>{displayChannel}</span>
            {item.viewCount && <><span>·</span><span>{formatViewCount(item.viewCount)}</span></>}
            {item.timestamp && <><span>·</span><span>{formatRelativeDate(item.timestamp)}</span></>}
          </div>
        </div>
      </div>
    </a>
  )

  // 모바일 카드
  const renderMobileCard = (item, i) => (
    <div key={`yt-mob-${item._id ?? i}`}>
      {renderCardInner(item)}
    </div>
  )

  // 데스크탑 크로스페이드 슬롯
  const renderSlot = (curIdx, nextIdx, isFading, slotKey) => (
    <div key={slotKey} className="relative" style={{ width: YT_CARD_W, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        {renderCardInner(items[nextIdx])}
      </div>
      <div style={{ position: 'relative', zIndex: 2, opacity: isFading ? 0 : 1, transition: isFading ? `opacity ${YT_FADE_MS}ms ease-in-out` : 'none' }}>
        {renderCardInner(items[curIdx])}
      </div>
    </div>
  )

  if (items.length === 0) {
    return (
      <div id="sns-youtube" className="md:mb-14 scroll-mt-24">
        <div className="md:hidden">
          <MobileSnsSlider
            items={[]}
            renderCard={() => null}
            profileUrl={channelUrl}
            iconEl={<YoutubeIcon />}
            wordmarkEl={<YoutubeWordmark />}
            name={displayChannel}
            tagline={tagline}
            iconSize="w-11 h-11"
            profileInfo={channelUrl ? {
              picture:        channelAvatar || null,
              username:       channelName || displayChannel,
              namePrefix:     '',
              mediaCount:     videoCount      ?? null,
              followersCount: subscriberCount ?? null,
              mediaLabel:     '동영상',
              followersLabel: '구독자',
            } : null}
          />
        </div>
        <div className="hidden md:block">
          <SectionHeader config={config} profileUrl={channelUrl} tagline={tagline} />
          <div className={`${bgLight} border ${borderColor} rounded-2xl py-10 text-center`}>
            <p className="text-brown-300 text-sm">등록된 영상이 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="sns-youtube" className="md:mb-14 scroll-mt-24">

      {/* ── 모바일: 피크 스와이프 슬라이더 ── */}
      <div className="md:hidden">
        <MobileSnsSlider
          items={items}
          renderCard={renderMobileCard}
          profileUrl={channelUrl}
          iconEl={<YoutubeIcon />}
          wordmarkEl={<YoutubeWordmark />}
          name={displayChannel}
          tagline={tagline}
          iconSize="w-11 h-11"
          profileInfo={channelUrl ? {
            picture:        channelAvatar || null,
            username:       channelName || displayChannel,
            namePrefix:     '',
            mediaCount:     videoCount      ?? null,
            followersCount: subscriberCount ?? null,
            mediaLabel:     '동영상',
            followersLabel: '구독자',
          } : null}
        />
      </div>

      {/* ── 데스크탑: 크로스페이드 자동 전환 ── */}
      <div className="hidden md:block">
        <SectionHeader config={config} profileUrl={channelUrl} tagline={tagline} />
        <div
          className="flex pb-6"
          style={{ gap: `${CARD_GAP}px` }}
          onMouseEnter={() => { pausedRef.current = true  }}
          onMouseLeave={() => { pausedRef.current = false }}
        >
          {renderSlot(leftCur, leftNext, leftFade, 'yt-left')}
          {items.length > 1 && renderSlot(rightCur, rightNext, rightFade, 'yt-right')}
        </div>
      </div>

    </div>
  )
}
