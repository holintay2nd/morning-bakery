import { useState } from 'react'
import { SNS_CONFIG, CARD_GAP } from './config'
import { parseCaption, formatRelativeDate } from './utils'
import { useConveyorBelt } from '../../hooks/useConveyorBelt'
import ConveyorWrap from './ConveyorWrap'
import SectionHeader from './SectionHeader'
import MobileCardSlider from './MobileCardSlider'

const IG_CARD_W  = 360  // 3장: 3×360 + 2×16 = 1112px
const IG_VISIBLE = 3
const IG_SPEED   = 20   // px/s

const config = SNS_CONFIG.find(c => c.key === 'instagram')

export default function InstagramSection({ items, username, profilePicture, tagline }) {
  const shouldScroll = items.length > IG_VISIBLE
  const [avatarError, setAvatarError] = useState(false)

  const { bgLight, borderColor, color } = config
  const cardSlot     = IG_CARD_W + CARD_GAP
  const loopDistance = items.length * cardSlot
  const trackItems   = shouldScroll ? [...items, ...items] : items

  const { trackRef, pausedRef, scrollCard } = useConveyorBelt({ shouldScroll, loopDistance, speed: IG_SPEED, cardSlot })

  const showAvatar = !!(profilePicture && !avatarError)

  const avatarEl = showAvatar ? (
    <img
      src={profilePicture}
      alt={username}
      className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-2 ring-white/40"
      onError={() => setAvatarError(true)}
    />
  ) : (
    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 ring-2 ring-white/40 p-[5px]`}>
      <svg viewBox="0 0 24 24" className="w-full h-full fill-white" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    </div>
  )

  // ── 데스크탑 카드 ──
  const renderCard = (item, i) => {
    const { title, body } = parseCaption(item.title)
    const timeAgo = formatRelativeDate(item.timestamp)
    return (
      <a
        key={`ig-${item._id ?? i}-${i}`}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex-shrink-0 block"
        style={{ width: `${IG_CARD_W}px` }}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
          <img src={item.thumbnail} alt={title || '인스타그램 게시물'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 space-y-2">
            <div className="flex items-center gap-2">
              {avatarEl}
              <span className="text-[12px] text-white/80 font-medium truncate">@{username || 'morningbakery_seoul'}</span>
              {timeAgo && <span className="text-[12px] text-white/50 font-medium flex-shrink-0">· {timeAgo}</span>}
            </div>
            {title && <p className="text-[15px] font-bold text-white line-clamp-1 leading-snug">{title}</p>}
            {body  && <p className="text-[12px] text-white/70 line-clamp-2 leading-relaxed">{body}</p>}
          </div>
        </div>
      </a>
    )
  }

  // ── 모바일 카드 (전체폭, 고정 width 없음) ──
  const renderMobileCard = (item, i) => {
    const { title, body } = parseCaption(item.title)
    const timeAgo = formatRelativeDate(item.timestamp)
    return (
      <a
        key={`ig-mob-${item._id ?? i}`}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl overflow-hidden shadow-md"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
          <img src={item.thumbnail} alt={title || '인스타그램 게시물'} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 space-y-2">
            <div className="flex items-center gap-2">
              {avatarEl}
              <span className="text-[12px] text-white/80 font-medium truncate">@{username || 'morningbakery_seoul'}</span>
              {timeAgo && <span className="text-[12px] text-white/50 flex-shrink-0">· {timeAgo}</span>}
            </div>
            {title && <p className="text-[15px] font-bold text-white line-clamp-1">{title}</p>}
            {body  && <p className="text-[12px] text-white/70 line-clamp-2">{body}</p>}
          </div>
        </div>
      </a>
    )
  }

  const profileUrl = username ? `https://www.instagram.com/${username}` : null

  if (items.length === 0) {
    return (
      <div id="sns-instagram" className="md:mb-14 scroll-mt-24">
        {/* 모바일 */}
        <div className="md:hidden pt-20 px-4 pb-6">
          <div className="mb-4"><SectionHeader config={config} tagline={tagline} /></div>
          <div className={`${bgLight} border ${borderColor} rounded-2xl py-10 text-center`}>
            <p className="text-brown-300 text-sm">등록된 게시물이 없습니다.</p>
          </div>
        </div>
        {/* 데스크탑 */}
        <div className="hidden md:block">
          <SectionHeader config={config} tagline={tagline} />
          <div className={`${bgLight} border ${borderColor} rounded-2xl py-10 text-center`}>
            <p className="text-brown-300 text-sm">등록된 게시물이 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="sns-instagram" className="md:mb-14 scroll-mt-24">

      {/* ── 모바일 레이아웃 ── */}
      <div className="md:hidden pt-20 px-4 pb-6">
        <div className="mb-4">
          <SectionHeader config={config} profileUrl={profileUrl} tagline={tagline} />
        </div>
        <MobileCardSlider items={items} renderCard={renderMobileCard} />
      </div>

      {/* ── 데스크탑 레이아웃 ── */}
      <div className="hidden md:block">
        <SectionHeader config={config} profileUrl={profileUrl} tagline={tagline} />
        <ConveyorWrap shouldScroll={shouldScroll} trackRef={trackRef} pausedRef={pausedRef} scrollCard={scrollCard} centered>
          {trackItems.map(renderCard)}
        </ConveyorWrap>
      </div>

    </div>
  )
}
