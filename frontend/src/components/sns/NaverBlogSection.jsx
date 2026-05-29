import { SNS_CONFIG, CARD_GAP } from './config'
import { formatBlogDate } from './utils'
import { useConveyorBelt } from '../../hooks/useConveyorBelt'
import ConveyorWrap from './ConveyorWrap'
import SectionHeader from './SectionHeader'

// 3장: 3×373.33 + 2×16 = 1152px (max-w-6xl 꽉 채움)
const NB_CARD_W  = (1152 - 2 * CARD_GAP) / 3
const NB_VISIBLE = 3
const NB_SPEED   = 20 // px/s

const config = SNS_CONFIG.find(c => c.key === 'naverBlog')

function NaverBlogIcon({ size = 'sm' }) {
  const cls = size === 'lg' ? 'w-14 h-14 opacity-15' : 'w-4 h-4 flex-shrink-0'
  return (
    <svg viewBox="0 0 20 20" className={cls} fill="none" aria-hidden="true">
      <rect x="2.5" y="2" width="3" height="16" rx="1.5" fill="#03C75A"/>
      <path d="M5.5 7 A4.5 5 0 0 1 5.5 17 Z" fill="#03C75A"/>
      <rect x="15.5" y="2" width="2" height="16" rx="1" fill="#03C75A"/>
    </svg>
  )
}

export default function NaverBlogSection({ items, blogTitle }) {
  const shouldScroll = items.length > NB_VISIBLE

  const { bgLight, borderColor } = config
  const cardSlot     = NB_CARD_W + CARD_GAP
  const loopDistance = items.length * cardSlot
  const trackItems   = shouldScroll ? [...items, ...items] : items

  const { trackRef, pausedRef, scrollCard } = useConveyorBelt({ shouldScroll, loopDistance, speed: NB_SPEED, cardSlot })

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
      className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 flex-shrink-0 block"
      style={{ width: `${NB_CARD_W}px` }}
    >
      {/* 텍스트 섹션 */}
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <NaverBlogIcon />
            <span className="text-xs text-gray-600 font-medium truncate">{displayBlogTitle}</span>
          </div>
          {item.timestamp && (
            <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{formatBlogDate(item.timestamp)}</span>
          )}
        </div>
        <p className="text-sm font-bold text-gray-900 line-clamp-1 mb-1.5 leading-snug">{item.title}</p>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">{item.summary || ''}</p>
      </div>

      {/* 정방형 썸네일 */}
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
            <NaverBlogIcon size="lg" />
          </div>
        )}
      </div>
    </a>
  )

  return (
    <div className="mb-14">
      <SectionHeader config={config} total={items.length} />
      <ConveyorWrap shouldScroll={shouldScroll} trackRef={trackRef} pausedRef={pausedRef} scrollCard={scrollCard}>
        {trackItems.map(renderCard)}
      </ConveyorWrap>
    </div>
  )
}
