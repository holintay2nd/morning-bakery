import { useState } from 'react'
import { SNS_CONFIG, CARD_GAP, CAROUSEL_CYCLE_MS, CAROUSEL_FADE_MS } from './config'
import { parseCaption, formatRelativeDate } from './utils'
import { useCarouselFade } from '../../hooks/useCarouselFade'
import SectionHeader from './SectionHeader'
import MobileSnsSlider from './MobileSnsSlider'

const IG_CARD_W  = 360   // 3장: 3×360 + 2×16 = 1112px
const IG_VISIBLE = 3
const IG_MIN_H   = Math.round(IG_CARD_W * 4 / 3)  // aspect-[3/4]

const config = SNS_CONFIG.find(c => c.key === 'instagram')

const InstagramWordmark = () => (
  <img
    src="/Instagram_wordmark.png?v=2"
    alt="Instagram"
    className="h-10 w-auto object-contain"
    draggable={false}
  />
)

const IgBigIcon = () => (
  <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-1.5">
    <svg viewBox="0 0 24 24" className="w-full h-full fill-white" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  </div>
)

export default function InstagramSection({ items, username, profilePicture, tagline, igProfile }) {
  const [avatarError, setAvatarError] = useState(false)

  const { slots: [s0, s1, s2], pausedRef, shouldRotate } = useCarouselFade({
    items,
    visible:  IG_VISIBLE,
    cycleMs:  CAROUSEL_CYCLE_MS,
    fadeMs:   CAROUSEL_FADE_MS,
  })

  const { bgLight, borderColor, color } = config
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

  const renderCardInner = (item) => {
    const { title, body } = parseCaption(item.title)
    const timeAgo = formatRelativeDate(item.timestamp)
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-2xl overflow-hidden shadow-sm md:hover:shadow-xl transition-shadow duration-300 block touch-manipulation"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
          <img src={item.thumbnail} alt={title || '인스타그램 게시물'} className="w-full h-full object-cover md:group-hover:scale-105 md:transition-transform md:duration-700" loading="lazy" />
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

  const renderMobileCard = (item, i) => (
    <div key={`ig-mob-${item._id ?? i}`} className="rounded-2xl overflow-hidden shadow-md">
      {renderCardInner(item)}
    </div>
  )

  const renderSlot = ({ cur, next, fading }, key) => (
    <div key={key} className="relative" style={{ width: IG_CARD_W, flexShrink: 0, minHeight: IG_MIN_H }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: fading ? 1 : 0, transition: fading ? `opacity ${CAROUSEL_FADE_MS}ms ease-in-out` : 'none' }}>
        {renderCardInner(items[next])}
      </div>
      <div style={{ position: 'relative', zIndex: 2, opacity: fading ? 0 : 1, transition: fading ? `opacity ${CAROUSEL_FADE_MS}ms ease-in-out` : 'none' }}>
        {renderCardInner(items[cur])}
      </div>
    </div>
  )

  const profileUrl = username ? `https://www.instagram.com/${username}` : null

  // 단일 프로필 행: avatar + [ID / 게시물·팔로워 스택] + 더 보기 버튼
  const profileEl = profileUrl ? (
    <div className="flex items-center gap-3 w-full">
      {showAvatar ? (
        <img
          src={profilePicture}
          alt={username}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          onError={() => setAvatarError(true)}
        />
      ) : (
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 p-2`}>
          <svg viewBox="0 0 24 24" className="w-full h-full fill-white" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 leading-tight truncate">@{username}</p>
        {(igProfile?.mediaCount != null || igProfile?.followersCount != null) && (
          <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
            {igProfile.mediaCount != null && (
              <span>게시물{' '}<strong className="text-gray-700">{igProfile.mediaCount.toLocaleString()}</strong></span>
            )}
            {igProfile.followersCount != null && (
              <span>팔로워{' '}<strong className="text-gray-700">{igProfile.followersCount.toLocaleString()}</strong></span>
            )}
          </div>
        )}
      </div>
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 px-3 py-1 rounded-lg bg-gray-100 text-xs font-bold text-gray-700 active:opacity-70 transition-opacity"
      >
        이동
      </a>
    </div>
  ) : null

  if (items.length === 0) {
    return (
      <div id="sns-instagram" className="md:mb-14 scroll-mt-24">
        <div className="md:hidden">
          <MobileSnsSlider
            items={[]}
            renderCard={() => null}
            profileUrl={profileUrl}
            iconEl={<IgBigIcon />}
            wordmarkEl={<InstagramWordmark />}
            name="인스타그램"
            tagline={tagline}
            logoClickable={false}
            headerTopPadding="pt-[52px]"
          />
        </div>
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
      <div className="md:hidden">
        <MobileSnsSlider
          items={items}
          renderCard={renderMobileCard}
          profileUrl={profileUrl}
          iconEl={<IgBigIcon />}
          wordmarkEl={<InstagramWordmark />}
          name="인스타그램"
          tagline={tagline}
          logoClickable={false}
          headerTopPadding="pt-14"
          profileEl={profileEl}
        />
      </div>
      <div className="hidden md:block">
        <SectionHeader config={config} profileUrl={profileUrl} tagline={tagline} />
        <div
          className="flex pb-6"
          style={{ gap: `${CARD_GAP}px` }}
          onMouseEnter={() => { pausedRef.current = true  }}
          onMouseLeave={() => { pausedRef.current = false }}
        >
          {shouldRotate ? (
            <>
              {renderSlot(s0, 'ig-0')}
              {renderSlot(s1, 'ig-1')}
              {renderSlot(s2, 'ig-2')}
            </>
          ) : (
            items.map((item, i) => (
              <div key={`ig-static-${i}`} style={{ width: IG_CARD_W, flexShrink: 0, minHeight: IG_MIN_H }}>
                {renderCardInner(item)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
