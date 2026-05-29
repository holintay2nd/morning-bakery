import { useState } from 'react'
import { SNS_CONFIG, CARD_GAP } from './config'
import { formatRelativeDate } from './utils'
import { useConveyorBelt } from '../../hooks/useConveyorBelt'
import ConveyorWrap from './ConveyorWrap'
import SectionHeader from './SectionHeader'

// 블로그와 동일: 3×373.33 + 2×16 = 1152px (max-w-6xl 꽉 채움)
const TH_CARD_W  = (1152 - 2 * CARD_GAP) / 3
const TH_VISIBLE = 3
const TH_SPEED   = 20 // px/s

// 이미지 수 → grid-cols 클래스 (lookup으로 동적 문자열 조합 회피)
const GRID_COLS = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' }

const config = SNS_CONFIG.find(c => c.key === 'threads')

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full fill-white" aria-hidden="true">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 9.938C8.33 9.053 9.1 8.29 10.11 7.75 11.175 7.19 12.43 6.944 13.855 6.944c1.994.016 3.659.703 4.818 1.992 1.129 1.256 1.704 2.945 1.89 5.01.336.22.654.455.949.704 1.2 1.008 1.92 2.254 2.044 3.503.144 1.427-.263 3.042-1.195 4.394-.997 1.44-2.471 2.482-4.376 3.098C16.48 23.755 14.434 24 12.186 24zm2.842-12.97c-.507-.03-1.02-.041-1.528-.029-1.079.06-1.909.345-2.42.826-.421.365-.627.828-.597 1.342.058 1.073 1.168 1.618 2.518 1.544 1.237-.068 2.55-.663 2.847-3.032a10.374 10.374 0 0 0-.82-.651z"/>
  </svg>
)

export default function ThreadsSection({ items, username, profilePicture, tagline }) {
  const shouldScroll = items.length > TH_VISIBLE
  const [avatarError, setAvatarError] = useState(false)

  const { bgLight, borderColor } = config
  const cardSlot     = TH_CARD_W + CARD_GAP
  const loopDistance = items.length * cardSlot
  const trackItems   = shouldScroll ? [...items, ...items] : items

  const { trackRef, pausedRef, scrollCard } = useConveyorBelt({ shouldScroll, loopDistance, speed: TH_SPEED, cardSlot })

  if (items.length === 0) {
    return (
      <div className="mb-14">
        <SectionHeader config={config} profileUrl={username ? `https://www.threads.net/@${username}` : null} tagline={tagline} />
        <div className={`${bgLight} border ${borderColor} rounded-2xl py-10 text-center`}>
          <p className="text-brown-300 text-sm">등록된 게시물이 없습니다.</p>
        </div>
      </div>
    )
  }

  const showAvatar      = !!(profilePicture && !avatarError)
  const displayUsername = username || 'threads'

  const renderCard = (item, i) => {
    const images   = item.images?.length > 0 ? item.images : (item.thumbnail ? [item.thumbnail] : [])
    const gridCols = GRID_COLS[Math.min(images.length, 3)] ?? 'grid-cols-3'

    return (
      <a
        key={`th-${item._id ?? i}-${i}`}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 flex-shrink-0 block"
        style={{ width: `${TH_CARD_W}px` }}
      >
        {/* 헤더: 프로필 + 이름 + 시간 */}
        <div className="flex items-center gap-2.5 px-3.5 pt-3.5 pb-2">
          {showAvatar ? (
            <img
              src={profilePicture}
              alt={displayUsername}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 p-1.5">
              <ThreadsIcon />
            </div>
          )}
          <span className="text-sm font-bold text-gray-900 truncate">{displayUsername}</span>
          {item.timestamp && (
            <span className="text-xs text-gray-400 flex-shrink-0">{formatRelativeDate(item.timestamp)}</span>
          )}
        </div>

        {/* 본문 — 이미지 있으면 2줄, 없으면 최대 12줄 */}
        <p className={`px-3.5 pb-3 text-sm text-gray-800 leading-relaxed whitespace-pre-line ${
          images.length > 0 ? 'line-clamp-2' : 'line-clamp-[12]'
        }`}>
          {item.text || ''}
        </p>

        {/* 이미지 그리드: 1장→전체폭 | 2장→2열 | 3장→3열 */}
        {images.length > 0 && (
          <div className={`px-3.5 pb-3.5 grid gap-1.5 ${gridCols}`}>
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
    <div id="sns-threads" className="mb-14">
      <SectionHeader config={config} profileUrl={username ? `https://www.threads.net/@${username}` : null} tagline={tagline} />
      {/* alignStart: 카드 높이를 콘텐츠에 맞게 auto (align-items: flex-start 인라인 스타일) */}
      <ConveyorWrap shouldScroll={shouldScroll} trackRef={trackRef} pausedRef={pausedRef} scrollCard={scrollCard} alignStart>
        {trackItems.map(renderCard)}
      </ConveyorWrap>
    </div>
  )
}
