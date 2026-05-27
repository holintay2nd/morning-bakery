import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../api'

// ─── SNS 설정 ─────────────────────────────────────────────────────────────────
const SNS_CONFIG = [
  {
    key: 'instagram',
    label: '인스타그램',
    color: 'from-purple-500 via-pink-500 to-orange-400',
    textColor: 'text-pink-600',
    bgLight: 'bg-pink-50',
    borderColor: 'border-pink-200',
    Icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    key: 'youtube',
    label: '유튜브',
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-600',
    bgLight: 'bg-red-50',
    borderColor: 'border-red-200',
    Icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    key: 'naverBlog',
    label: '네이버 블로그',
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-700',
    bgLight: 'bg-green-50',
    borderColor: 'border-green-200',
    // 네이버 블로그 공식 "b|" 아이콘
    Icon: () => (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current" aria-hidden="true">
        <rect x="2.5" y="2" width="3" height="16" rx="1.5"/>
        <path d="M5.5 7 A4.5 5 0 0 1 5.5 17 Z"/>
        <rect x="15.5" y="2" width="2" height="16" rx="1"/>
      </svg>
    ),
  },
  {
    key: 'threads',
    label: '스레드',
    color: 'from-gray-700 to-gray-900',
    textColor: 'text-gray-800',
    bgLight: 'bg-gray-50',
    borderColor: 'border-gray-200',
    Icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 9.938C8.33 9.053 9.1 8.29 10.11 7.75 11.175 7.19 12.43 6.944 13.855 6.944c1.994.016 3.659.703 4.818 1.992 1.129 1.256 1.704 2.945 1.89 5.01.336.22.654.455.949.704 1.2 1.008 1.92 2.254 2.044 3.503.144 1.427-.263 3.042-1.195 4.394-.997 1.44-2.471 2.482-4.376 3.098C16.48 23.755 14.434 24 12.186 24zm2.842-12.97c-.507-.03-1.02-.041-1.528-.029-1.079.06-1.909.345-2.42.826-.421.365-.627.828-.597 1.342.058 1.073 1.168 1.618 2.518 1.544 1.237-.068 2.55-.663 2.847-3.032a10.374 10.374 0 0 0-.82-.651z"/>
      </svg>
    ),
  },
  {
    key: 'article',
    label: '기사',
    color: 'from-blue-500 to-blue-700',
    textColor: 'text-blue-700',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    Icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-blue-700" aria-hidden="true">
        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4zM2 3h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h18V5H3z"/>
      </svg>
    ),
  },
]

// ─── 공통 섹션 헤더 ───────────────────────────────────────────────────────────
function SectionHeader({ config, total }) {
  const { label, color, Icon } = config
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className={`inline-flex items-center gap-1.5 text-white font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${color} shadow-sm text-sm`}>
        <Icon />
        {label}
      </span>
      {total > 0 && <span className="text-brown-300 text-xs">({total})</span>}
    </div>
  )
}

// ─── 인스타그램 컨베이어 벨트 섹션 ───────────────────────────────────────────
const IG_CARD_W   = 360  // px — 3장: 3×360 + 2×16 = 1112px (max-w-6xl 이내)
const IG_CARD_GAP = 16
const IG_VISIBLE  = 3
const IG_SPEED    = 20   // px/s

// 캡션 파싱: 첫 줄 → 제목, 나머지 → 본문 (구분자 줄 제외)
function parseCaption(caption = '') {
  const lines = caption.split('\n').map(l => l.trim()).filter(Boolean)
  const title = lines[0] || ''
  const body = lines
    .slice(1)
    .filter(l => !/^[.·•\-=_~]+$/.test(l))
    .join(' ')
    .trim()
  return { title, body }
}

function InstagramSection({ items, username, profilePicture }) {
  const shouldScroll = items.length > IG_VISIBLE
  const [avatarError, setAvatarError] = useState(false)

  const trackRef  = useRef(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const lastTsRef = useRef(null)
  const rafRef    = useRef(null)

  const config = SNS_CONFIG.find(c => c.key === 'instagram')
  const { bgLight, borderColor, color } = config

  const loopDistance = items.length * (IG_CARD_W + IG_CARD_GAP)
  const trackItems   = shouldScroll ? [...items, ...items] : items

  useEffect(() => {
    if (!shouldScroll) return
    const animate = (ts) => {
      if (!pausedRef.current) {
        if (lastTsRef.current != null) {
          const dt = Math.min(ts - lastTsRef.current, 50)
          offsetRef.current = (offsetRef.current + IG_SPEED * dt / 1000) % loopDistance
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
  }, [shouldScroll, loopDistance])

  const scrollCard = (dir) => {
    const slot = IG_CARD_W + IG_CARD_GAP
    const cur  = offsetRef.current
    const next = dir > 0
      ? (Math.floor(cur / slot) + 1) * slot
      : (Math.ceil(cur / slot)  - 1) * slot
    offsetRef.current = ((next % loopDistance) + loopDistance) % loopDistance
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`
  }

  if (items.length === 0) {
    return (
      <div className="mb-14">
        <SectionHeader config={config} total={0} />
        <div className={`${bgLight} border ${borderColor} rounded-2xl py-10 text-center`}>
          <p className="text-brown-300 text-sm">등록된 게시물이 없습니다.</p>
        </div>
      </div>
    )
  }

  const showAvatar = !!(profilePicture && !avatarError)

  const renderCard = (item, i) => {
    const { title, body } = parseCaption(item.title)
    return (
      <a
        key={`ig-${item._id ?? i}-${i}`}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex-shrink-0 block"
        style={{ width: `${IG_CARD_W}px`, marginRight: `${IG_CARD_GAP}px` }}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
          <img
            src={item.thumbnail}
            alt={title || '인스타그램 게시물'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 space-y-2">
            <div className="flex items-center gap-2">
              {showAvatar ? (
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
              )}
              <span className="text-[12px] text-white/80 font-medium truncate">
                @{username || 'morningbakery_seoul'}
              </span>
            </div>
            {title && (
              <p className="text-[15px] font-bold text-white line-clamp-1 leading-snug">{title}</p>
            )}
            {body && (
              <p className="text-[12px] text-white/70 line-clamp-2 leading-relaxed">{body}</p>
            )}
          </div>
        </div>
      </a>
    )
  }

  return (
    <div className="mb-14">
      <SectionHeader config={config} total={items.length} />

      <div className="relative">
        {shouldScroll && (
          <>
            <button
              onClick={() => scrollCard(-1)}
              aria-label="이전"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20
                         text-gray-300 hover:text-gray-600 transition-colors duration-200"
            >
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scrollCard(1)}
              aria-label="다음"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20
                         text-gray-300 hover:text-gray-600 transition-colors duration-200"
            >
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>
          </>
        )}

        <div
          className="overflow-hidden"
          onMouseEnter={shouldScroll ? () => { pausedRef.current = true  } : undefined}
          onMouseLeave={shouldScroll ? () => { pausedRef.current = false } : undefined}
        >
          {shouldScroll ? (
            <div ref={trackRef} className="flex">
              {trackItems.map(renderCard)}
            </div>
          ) : (
            <div className="flex justify-center" style={{ gap: `${IG_CARD_GAP}px` }}>
              {items.map(renderCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── 유튜브 컨베이어 벨트 섹션 ───────────────────────────────────────────────
// 2장이 정확히 꽉 참: 2×568 + 16 = 1152px (max-w-6xl)
const YT_CARD_W   = 568
const YT_CARD_GAP = 16
const YT_VISIBLE  = 2
const YT_SPEED    = 20  // px/s

function formatViewCount(count) {
  if (!count) return ''
  const n = parseInt(count, 10)
  if (Number.isNaN(n)) return ''
  if (n >= 100_000_000) return `조회수 ${(n / 100_000_000).toFixed(1)}억회`
  if (n >= 10_000)      return `조회수 ${(n / 10_000).toFixed(1)}만회`
  if (n >= 1_000)       return `조회수 ${(n / 1_000).toFixed(1)}천회`
  return `조회수 ${n}회`
}

function formatRelativeDate(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const h  = Math.floor(diff / 3_600_000)
  const d  = Math.floor(diff / 86_400_000)
  const mo = Math.floor(d / 30)
  const y  = Math.floor(d / 365)
  if (y  >= 1) return `${y}년 전`
  if (mo >= 1) return `${mo}개월 전`
  if (d  >= 1) return `${d}일 전`
  if (h  >= 1) return `${h}시간 전`
  return '방금 전'
}

function YoutubeSection({ items, channelName, channelAvatar }) {
  const shouldScroll = items.length > YT_VISIBLE
  const [avatarError, setAvatarError] = useState(false)

  const trackRef  = useRef(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const lastTsRef = useRef(null)
  const rafRef    = useRef(null)

  const config = SNS_CONFIG.find(c => c.key === 'youtube')
  const { bgLight, borderColor, color } = config

  const loopDistance = items.length * (YT_CARD_W + YT_CARD_GAP)
  const trackItems   = shouldScroll ? [...items, ...items] : items

  useEffect(() => {
    if (!shouldScroll) return
    const animate = (ts) => {
      if (!pausedRef.current) {
        if (lastTsRef.current != null) {
          const dt = Math.min(ts - lastTsRef.current, 50)
          offsetRef.current = (offsetRef.current + YT_SPEED * dt / 1000) % loopDistance
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
  }, [shouldScroll, loopDistance])

  const scrollCard = (dir) => {
    const slot = YT_CARD_W + YT_CARD_GAP
    const cur  = offsetRef.current
    const next = dir > 0
      ? (Math.floor(cur / slot) + 1) * slot
      : (Math.ceil(cur / slot)  - 1) * slot
    offsetRef.current = ((next % loopDistance) + loopDistance) % loopDistance
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`
  }

  if (items.length === 0) {
    return (
      <div className="mb-14">
        <SectionHeader config={config} total={0} />
        <div className={`${bgLight} border ${borderColor} rounded-2xl py-10 text-center`}>
          <p className="text-brown-300 text-sm">등록된 영상이 없습니다.</p>
        </div>
      </div>
    )
  }

  const showAvatar = !!(channelAvatar && !avatarError)
  const displayChannel = channelName || 'YouTube'

  const renderCard = (item, i) => (
    <a
      key={`yt-${item._id ?? i}-${i}`}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 flex-shrink-0 block rounded-2xl"
      style={{ width: `${YT_CARD_W}px`, marginRight: `${YT_CARD_GAP}px` }}
    >
      {/* 16:9 썸네일 — 독립적으로 전체 둥글게 */}
      <div className="relative aspect-video overflow-hidden bg-gray-200 rounded-2xl">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          onError={e => { e.target.src = `https://i.ytimg.com/vi/${item._id}/hqdefault.jpg` }}
        />
      </div>

      {/* 카드 하단 정보 */}
      <div className="p-4 flex gap-3 items-start">
        <div className="flex-shrink-0 mt-0.5">
          {showAvatar ? (
            <img
              src={channelAvatar}
              alt={displayChannel}
              className="w-9 h-9 rounded-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center p-2`}>
              <svg viewBox="0 0 24 24" className="w-full h-full fill-white" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-brown-800 text-sm font-semibold line-clamp-2 leading-snug mb-1.5">
            {item.title}
          </p>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-brown-400 text-xs">
            <span>{displayChannel}</span>
            {item.viewCount && (
              <>
                <span>·</span>
                <span>{formatViewCount(item.viewCount)}</span>
              </>
            )}
            {item.timestamp && (
              <>
                <span>·</span>
                <span>{formatRelativeDate(item.timestamp)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </a>
  )

  return (
    <div className="mb-14">
      <SectionHeader config={config} total={items.length} />

      <div className="relative">
        {shouldScroll && (
          <>
            <button
              onClick={() => scrollCard(-1)}
              aria-label="이전"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20
                         text-gray-300 hover:text-gray-600 transition-colors duration-200"
            >
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scrollCard(1)}
              aria-label="다음"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20
                         text-gray-300 hover:text-gray-600 transition-colors duration-200"
            >
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>
          </>
        )}

        <div
          className="overflow-hidden"
          onMouseEnter={shouldScroll ? () => { pausedRef.current = true  } : undefined}
          onMouseLeave={shouldScroll ? () => { pausedRef.current = false } : undefined}
        >
          {shouldScroll ? (
            <div ref={trackRef} className="flex">
              {trackItems.map(renderCard)}
            </div>
          ) : (
            <div className="flex" style={{ gap: `${YT_CARD_GAP}px` }}>
              {items.map(renderCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── 네이버 블로그 컨베이어 벨트 섹션 ────────────────────────────────────────
// 3장 고정: 3×360 + 2×16 = 1112px | 4장부터 순환
const NB_CARD_W   = 360
const NB_CARD_GAP = 16
const NB_VISIBLE  = 3
const NB_SPEED    = 20  // px/s

// "YYYY. M. D." 형식 (네이버 블로그 날짜 표기)
function formatBlogDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return ''
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`
}

// 카드 헤더에 쓰는 네이버 블로그 "b|" 컬러 아이콘
function NaverBlogIcon() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4 flex-shrink-0" fill="none" aria-hidden="true">
      <rect x="2.5" y="2" width="3" height="16" rx="1.5" fill="#03C75A"/>
      <path d="M5.5 7 A4.5 5 0 0 1 5.5 17 Z" fill="#03C75A"/>
      <rect x="15.5" y="2" width="2" height="16" rx="1" fill="#03C75A"/>
    </svg>
  )
}

function NaverBlogSection({ items, blogTitle }) {
  const shouldScroll = items.length > NB_VISIBLE

  const trackRef  = useRef(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const lastTsRef = useRef(null)
  const rafRef    = useRef(null)

  const config = SNS_CONFIG.find(c => c.key === 'naverBlog')
  const { bgLight, borderColor } = config

  const loopDistance = items.length * (NB_CARD_W + NB_CARD_GAP)
  const trackItems   = shouldScroll ? [...items, ...items] : items

  useEffect(() => {
    if (!shouldScroll) return
    const animate = (ts) => {
      if (!pausedRef.current) {
        if (lastTsRef.current != null) {
          const dt = Math.min(ts - lastTsRef.current, 50)
          offsetRef.current = (offsetRef.current + NB_SPEED * dt / 1000) % loopDistance
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
  }, [shouldScroll, loopDistance])

  const scrollCard = (dir) => {
    const slot = NB_CARD_W + NB_CARD_GAP
    const cur  = offsetRef.current
    const next = dir > 0
      ? (Math.floor(cur / slot) + 1) * slot
      : (Math.ceil(cur / slot)  - 1) * slot
    offsetRef.current = ((next % loopDistance) + loopDistance) % loopDistance
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`
  }

  if (items.length === 0) {
    return (
      <div className="mb-14">
        <SectionHeader config={config} total={0} />
        <div className={`${bgLight} border ${borderColor} rounded-2xl py-10 text-center`}>
          <p className="text-brown-300 text-sm">등록된 포스트가 없습니다.</p>
        </div>
      </div>
    )
  }

  const displayBlogTitle = blogTitle || '네이버 블로그'

  const renderCard = (item, i) => (
    <a
      key={`nb-${item._id ?? i}-${i}`}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 flex-shrink-0 block"
      style={{ width: `${NB_CARD_W}px`, marginRight: `${NB_CARD_GAP}px` }}
    >
      {/* 텍스트 섹션 (상단) */}
      <div className="p-3.5">
        {/* 행 1: 블로그 아이콘 + 이름 (좌) · 날짜 (우) */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <NaverBlogIcon />
            <span className="text-xs text-gray-600 font-medium truncate">{displayBlogTitle}</span>
          </div>
          {item.timestamp && (
            <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{formatBlogDate(item.timestamp)}</span>
          )}
        </div>
        {/* 행 2: 제목 (볼드) */}
        <p className="text-sm font-bold text-gray-900 line-clamp-1 mb-1.5 leading-snug">{item.title}</p>
        {/* 행 3: 내용 미리보기 (2줄) — 텍스트 없어도 높이 유지 */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">{item.summary || ''}</p>
      </div>

      {/* 1:1 정방형 썸네일 이미지 — 텍스트와 동일한 좌우 패딩, 모서리 둥글게 */}
      <div className="px-3.5 pb-3.5">
        {item.thumbnail ? (
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-square rounded-xl bg-green-50 flex items-center justify-center">
            <svg viewBox="0 0 20 20" className="w-14 h-14 opacity-15" fill="none" aria-hidden="true">
              <rect x="2.5" y="2" width="3" height="16" rx="1.5" fill="#03C75A"/>
              <path d="M5.5 7 A4.5 5 0 0 1 5.5 17 Z" fill="#03C75A"/>
              <rect x="15.5" y="2" width="2" height="16" rx="1" fill="#03C75A"/>
            </svg>
          </div>
        )}
      </div>
    </a>
  )

  return (
    <div className="mb-14">
      <SectionHeader config={config} total={items.length} />

      <div className="relative">
        {shouldScroll && (
          <>
            <button
              onClick={() => scrollCard(-1)}
              aria-label="이전"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20
                         text-gray-300 hover:text-gray-600 transition-colors duration-200"
            >
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scrollCard(1)}
              aria-label="다음"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20
                         text-gray-300 hover:text-gray-600 transition-colors duration-200"
            >
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>
          </>
        )}

        <div
          className="overflow-hidden"
          onMouseEnter={shouldScroll ? () => { pausedRef.current = true  } : undefined}
          onMouseLeave={shouldScroll ? () => { pausedRef.current = false } : undefined}
        >
          {shouldScroll ? (
            <div ref={trackRef} className="flex">
              {trackItems.map(renderCard)}
            </div>
          ) : (
            <div className="flex justify-center" style={{ gap: `${NB_CARD_GAP}px` }}>
              {items.map(renderCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── 스레드 섹션 ─────────────────────────────────────────────────────────────
// 2장: YouTube와 동일 너비 (2×568 + 16 = 1152px)
const TH_CARD_W   = 568
const TH_CARD_GAP = 16
const TH_VISIBLE  = 2
const TH_SPEED    = 20  // px/s

function ThreadsSection({ items, username, profilePicture }) {
  const shouldScroll = items.length > TH_VISIBLE
  const [avatarError, setAvatarError] = useState(false)

  const trackRef  = useRef(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const lastTsRef = useRef(null)
  const rafRef    = useRef(null)

  const config = SNS_CONFIG.find(c => c.key === 'threads')
  const { bgLight, borderColor } = config

  const loopDistance = items.length * (TH_CARD_W + TH_CARD_GAP)
  const trackItems   = shouldScroll ? [...items, ...items] : items

  useEffect(() => {
    if (!shouldScroll) return
    const animate = (ts) => {
      if (!pausedRef.current) {
        if (lastTsRef.current != null) {
          const dt = Math.min(ts - lastTsRef.current, 50)
          offsetRef.current = (offsetRef.current + TH_SPEED * dt / 1000) % loopDistance
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
  }, [shouldScroll, loopDistance])

  const scrollCard = (dir) => {
    const slot = TH_CARD_W + TH_CARD_GAP
    const cur  = offsetRef.current
    const next = dir > 0
      ? (Math.floor(cur / slot) + 1) * slot
      : (Math.ceil(cur / slot)  - 1) * slot
    offsetRef.current = ((next % loopDistance) + loopDistance) % loopDistance
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`
  }

  if (items.length === 0) {
    return (
      <div className="mb-14">
        <SectionHeader config={config} total={0} />
        <div className={`${bgLight} border ${borderColor} rounded-2xl py-10 text-center`}>
          <p className="text-brown-300 text-sm">등록된 게시물이 없습니다.</p>
        </div>
      </div>
    )
  }

  const showAvatar = !!(profilePicture && !avatarError)
  const displayUsername = username || 'threads'

  const renderCard = (item, i) => {
    const images = item.images?.length > 0 ? item.images : (item.thumbnail ? [item.thumbnail] : [])
    return (
      <a
        key={`th-${item._id ?? i}-${i}`}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 flex-shrink-0 block"
        style={{ width: `${TH_CARD_W}px`, marginRight: `${TH_CARD_GAP}px` }}
      >
        {/* 헤더: 프로필 아바타 + 유저명 + 시간 */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          {showAvatar ? (
            <img
              src={profilePicture}
              alt={displayUsername}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0 p-2">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-white" aria-hidden="true">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 9.938C8.33 9.053 9.1 8.29 10.11 7.75 11.175 7.19 12.43 6.944 13.855 6.944c1.994.016 3.659.703 4.818 1.992 1.129 1.256 1.704 2.945 1.89 5.01.336.22.654.455.949.704 1.2 1.008 1.92 2.254 2.044 3.503.144 1.427-.263 3.042-1.195 4.394-.997 1.44-2.471 2.482-4.376 3.098C16.48 23.755 14.434 24 12.186 24zm2.842-12.97c-.507-.03-1.02-.041-1.528-.029-1.079.06-1.909.345-2.42.826-.421.365-.627.828-.597 1.342.058 1.073 1.168 1.618 2.518 1.544 1.237-.068 2.55-.663 2.847-3.032a10.374 10.374 0 0 0-.82-.651z"/>
              </svg>
            </div>
          )}
          <span className="flex-1 text-sm font-bold text-gray-900 truncate">@{displayUsername}</span>
          {item.timestamp && (
            <span className="text-xs text-gray-400 flex-shrink-0">{formatRelativeDate(item.timestamp)}</span>
          )}
        </div>

        {/* 본문 텍스트 (4줄 제한) */}
        {item.text && (
          <p className="px-4 pb-3 text-sm text-gray-800 line-clamp-4 leading-relaxed whitespace-pre-line">
            {item.text}
          </p>
        )}

        {/* 이미지 그리드: 1장→전체폭 4:3 | 2장→2열 | 3장→3열 */}
        {images.length > 0 && (
          <div className={`px-4 pb-4 grid gap-1.5 ${
            images.length >= 3 ? 'grid-cols-3' :
            images.length === 2 ? 'grid-cols-2' :
            'grid-cols-1'
          }`}>
            {images.map((src, idx) => (
              <div key={idx} className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </a>
    )
  }

  return (
    <div className="mb-14">
      <SectionHeader config={config} total={items.length} />

      <div className="relative">
        {shouldScroll && (
          <>
            <button
              onClick={() => scrollCard(-1)}
              aria-label="이전"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20
                         text-gray-300 hover:text-gray-600 transition-colors duration-200"
            >
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scrollCard(1)}
              aria-label="다음"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20
                         text-gray-300 hover:text-gray-600 transition-colors duration-200"
            >
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>
          </>
        )}

        <div
          className="overflow-hidden"
          onMouseEnter={shouldScroll ? () => { pausedRef.current = true  } : undefined}
          onMouseLeave={shouldScroll ? () => { pausedRef.current = false } : undefined}
        >
          {shouldScroll ? (
            <div ref={trackRef} className="flex">
              {trackItems.map(renderCard)}
            </div>
          ) : (
            <div className="flex" style={{ gap: `${TH_CARD_GAP}px` }}>
              {items.map(renderCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── 일반 SNS 섹션 (기사) ─────────────────────────────────────────────────────
function SnsSection({ config, items }) {
  const { textColor, bgLight, borderColor, Icon, color } = config
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  const total = items.length
  const slideCount = Math.ceil(total / 4)

  const prev = useCallback(() => setCurrent(c => (c <= 0 ? slideCount - 1 : c - 1)), [slideCount])
  const next = useCallback(() => setCurrent(c => (c >= slideCount - 1 ? 0 : c + 1)), [slideCount])

  useEffect(() => {
    if (paused || slideCount <= 1) return
    timerRef.current = setInterval(next, 3000)
    return () => clearInterval(timerRef.current)
  }, [paused, slideCount, next])

  if (total === 0) {
    return (
      <div className="mb-14">
        <SectionHeader config={config} total={0} />
        <div className={`${bgLight} border ${borderColor} rounded-2xl py-10 text-center`}>
          <p className="text-brown-300 text-sm">등록된 게시물이 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-14">
      <SectionHeader config={config} total={total} />

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          onClick={prev}
          aria-label="이전"
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
            w-9 h-9 rounded-full bg-white shadow-md border ${borderColor}
            flex items-center justify-center ${textColor}
            hover:scale-110 transition-transform duration-200
            disabled:opacity-30`}
          disabled={total <= 1}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {Array.from({ length: slideCount }).map((_, slideIdx) => (
              <div key={slideIdx} className="grid grid-cols-2 lg:grid-cols-4 shrink-0 w-full gap-4 px-1">
                {items.slice(slideIdx * 4, slideIdx * 4 + 4).map((item, i) => (
                  <a
                    key={item._id || i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group rounded-xl overflow-hidden bg-white border ${borderColor}
                      hover:shadow-lg transition-shadow duration-300`}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span
                        className={`absolute top-2 left-2 inline-flex items-center gap-1
                          text-white text-[10px] font-semibold px-2 py-0.5 rounded-full
                          bg-gradient-to-r ${color} shadow-sm`}
                      >
                        <Icon />
                        <span className="hidden sm:inline">{config.label}</span>
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-brown-700 text-xs font-medium line-clamp-2 leading-relaxed">
                        {item.title}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={next}
          aria-label="다음"
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
            w-9 h-9 rounded-full bg-white shadow-md border ${borderColor}
            flex items-center justify-center ${textColor}
            hover:scale-110 transition-transform duration-200
            disabled:opacity-30`}
          disabled={total <= 1}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {slideCount > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`${i + 1}번 슬라이드`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                current === i ? `bg-gradient-to-r ${color} w-4` : 'bg-brown-200 w-1.5'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── 메인 SNS 캐러셀 섹션 ────────────────────────────────────────────────────
export default function SnsCarousel() {
  const [snsData, setSnsData] = useState(null)
  const [igUsername, setIgUsername] = useState('')
  const [igProfilePicture, setIgProfilePicture] = useState('')
  const [ytChannelName, setYtChannelName] = useState('')
  const [ytChannelAvatar, setYtChannelAvatar] = useState('')
  const [nbBlogTitle, setNbBlogTitle] = useState('')
  const [thUsername, setThUsername] = useState('')
  const [thProfilePicture, setThProfilePicture] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      api.get('/content/sns'),
      api.get('/instagram/feed'),
      api.get('/youtube/feed'),
      api.get('/threads/feed'),
      api.get('/naverblog/feed'),
    ]).then(([snsResult, igResult, ytResult, thResult, nbResult]) => {
      const sns    = snsResult.status === 'fulfilled' ? snsResult.value.data : {}
      const igData = igResult.status === 'fulfilled'  ? igResult.value.data  : null
      const ytData = ytResult.status === 'fulfilled'  ? ytResult.value.data  : null
      const thData = thResult.status === 'fulfilled'  ? thResult.value.data  : null
      const nbData = nbResult.status === 'fulfilled'  ? nbResult.value.data  : null

      // { items, username, profilePicture } 형식 + 하위 호환(배열)
      const igItems = Array.isArray(igData) ? igData : (igData?.items ?? null)
      if (igData?.username)        setIgUsername(igData.username)
      if (igData?.profilePicture)  setIgProfilePicture(igData.profilePicture)

      // { items, channelName, channelAvatar } 형식 + 하위 호환(배열)
      const ytItems = Array.isArray(ytData) ? ytData : (ytData?.items ?? null)
      if (ytData?.channelName)   setYtChannelName(ytData.channelName)
      if (ytData?.channelAvatar) setYtChannelAvatar(ytData.channelAvatar)

      // { items, blogTitle } 형식 + 하위 호환(배열)
      const nbItems = Array.isArray(nbData) ? nbData : (nbData?.items ?? null)
      if (nbData?.blogTitle) setNbBlogTitle(nbData.blogTitle)

      // { items, username, profilePicture } 형식 + 하위 호환(배열)
      const thItems = Array.isArray(thData) ? thData : (thData?.items ?? null)
      if (thData?.username)        setThUsername(thData.username)
      if (thData?.profilePicture)  setThProfilePicture(thData.profilePicture)

      setSnsData({
        ...sns,
        instagram: igItems ?? sns.instagram ?? [],
        youtube:   ytItems ?? sns.youtube   ?? [],
        threads:   thItems ?? sns.threads   ?? [],
        naverBlog: nbItems ?? sns.naverBlog ?? [],
      })
    }).finally(() => setLoading(false))
  }, [])

  return (
    <section id="sns" className="py-24 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="section-subtitle">Follow Us</p>
        <h2 className="section-title mb-3">SNS에서 만나요</h2>
        <p className="text-center text-brown-400 text-sm mb-14">
          인스타그램, 유튜브, 네이버 블로그 등 다양한 채널에서 모닝베이커리의 소식을 전해드립니다.
        </p>

        {loading ? (
          <div className="py-20 text-center text-brown-400 text-sm">불러오는 중...</div>
        ) : !snsData ? (
          <div className="py-20 text-center text-brown-400 text-sm">SNS 정보를 불러올 수 없습니다.</div>
        ) : (
          <div>
            {/* 인스타그램: 3:4 카드, 컨베이어 벨트 */}
            <InstagramSection
              items={snsData.instagram ?? []}
              username={igUsername}
              profilePicture={igProfilePicture}
            />

            {/* 유튜브: 16:9 카드, 컨베이어 벨트 */}
            <YoutubeSection
              items={snsData.youtube ?? []}
              channelName={ytChannelName}
              channelAvatar={ytChannelAvatar}
            />

            {/* 네이버 블로그: 텍스트+1:1 이미지 카드, 컨베이어 벨트 */}
            <NaverBlogSection
              items={snsData.naverBlog ?? []}
              blogTitle={nbBlogTitle}
            />

            {/* 스레드: Threads 앱 스타일, 컨베이어 벨트 */}
            <ThreadsSection
              items={snsData.threads ?? []}
              username={thUsername}
              profilePicture={thProfilePicture}
            />

            {/* 나머지 SNS (기사): 기존 슬라이드 방식 */}
            {SNS_CONFIG
              .filter(c => !['instagram', 'youtube', 'naverBlog', 'threads'].includes(c.key))
              .map((config) => (
                <SnsSection
                  key={config.key}
                  config={config}
                  items={snsData[config.key] || []}
                />
              ))}
          </div>
        )}
      </div>
    </section>
  )
}
