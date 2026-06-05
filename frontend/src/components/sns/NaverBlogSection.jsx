import { SNS_CONFIG, CARD_GAP, CAROUSEL_CYCLE_MS, CAROUSEL_FADE_MS } from './config'
import { formatBlogDate } from './utils'
import { useCarouselFade } from '../../hooks/useCarouselFade'
import SectionHeader from './SectionHeader'
import MobileSnsSlider from './MobileSnsSlider'

// 3장: 3×373.33 + 2×16 = 1152px (max-w-6xl 꽉 채움)
const NB_CARD_W  = (1152 - 2 * CARD_GAP) / 3
const NB_VISIBLE = 3
const NB_THUMB   = Math.round(NB_CARD_W - 28)
const NB_MIN_H   = 14 + 40 + 70 + 14 + NB_THUMB + 14

const config = SNS_CONFIG.find(c => c.key === 'naverBlog')

const NaverBlogIcon = () => (
  <img src="/naver_blog_logo_black.png" alt="네이버 블로그" className="w-full h-full object-contain" draggable={false} />
)
const NaverBlogWordmark = () => (
  <img src="/naver_blog_wordmark(2)_black.svg" alt="네이버 블로그" className="h-7 w-auto" draggable={false} />
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
  const { slots: [s0, s1, s2], pausedRef, shouldRotate } = useCarouselFade({
    items,
    visible: NB_VISIBLE,
    cycleMs: CAROUSEL_CYCLE_MS,
    fadeMs:  CAROUSEL_FADE_MS,
  })

  const { bgLight, borderColor } = config
  const displayBlogTitle = (blogTitle || '네이버 블로그').replace(/님의\s*블로그$/, '').trim()

  // 단일 프로필 행: 블로그명 + 게시물 수(RSS) + 이동 버튼
  const profileEl = blogUrl ? (
    <div className="flex items-center gap-2 w-full">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-400" aria-hidden="true">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 leading-tight truncate">{displayBlogTitle}</p>
        {items.length > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">
            게시물{' '}<strong className="text-gray-700">{items.length}</strong>
          </p>
        )}
      </div>
      <a
        href={blogUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 inline-flex items-center justify-center px-3.5 py-2 rounded-lg bg-gray-100 text-xs font-bold text-gray-700 active:opacity-70 transition-opacity"
      >
        <span className="translate-y-px">이동</span>
      </a>
    </div>
  ) : null

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

  // 모바일 카드: 텍스트 위, 이미지 아래, 자연 높이
  const renderMobileCard = (item, i) => (
    <a
      key={`nb-mob-${item._id ?? i}`}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden touch-manipulation"
      style={{ WebkitTapHighlightColor: 'transparent' }}
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
        <p className="text-sm font-bold text-gray-900 line-clamp-2 mb-1.5 leading-snug">{item.title}</p>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">{item.summary || ''}</p>
      </div>
      <div className="px-3.5 pb-3.5">
        {item.thumbnail ? (
          <div className="overflow-hidden rounded-xl bg-gray-100">
            <img src={item.thumbnail} alt={item.title} className="w-full h-auto object-cover" loading="lazy" />
          </div>
        ) : (
          <NaverBlogPlaceholder />
        )}
      </div>
    </a>
  )

  const renderSlot = ({ cur, next, fading }, key) => (
    <div key={key} className="relative" style={{ width: NB_CARD_W, flexShrink: 0, minHeight: NB_MIN_H }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: fading ? 1 : 0, transition: fading ? `opacity ${CAROUSEL_FADE_MS}ms ease-in-out` : 'none' }}>
        {renderCard(items[next])}
      </div>
      <div style={{ position: 'relative', zIndex: 2, opacity: fading ? 0 : 1, transition: fading ? `opacity ${CAROUSEL_FADE_MS}ms ease-in-out` : 'none' }}>
        {renderCard(items[cur])}
      </div>
    </div>
  )

  if (items.length === 0) {
    return (
      <div id="sns-naverblog" className="md:mb-14 scroll-mt-24">
        <div className="md:hidden">
          <MobileSnsSlider
            items={[]}
            renderCard={() => null}
            profileUrl={blogUrl}
            iconEl={<NaverBlogIcon />}
            wordmarkEl={<NaverBlogWordmark />}
            name={displayBlogTitle}
            tagline={tagline}
            iconSize="w-10 h-10"
            logoClickable={false}
            headerTopPadding="pt-[52px]"
            profileEl={profileEl}
          />
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
      <div className="md:hidden">
        <MobileSnsSlider
          items={items}
          renderCard={renderMobileCard}
          profileUrl={blogUrl}
          iconEl={<NaverBlogIcon />}
          wordmarkEl={<NaverBlogWordmark />}
          name={displayBlogTitle}
          tagline={tagline}
          iconSize="w-10 h-10"
          profileInfo={blogUrl ? {
            picture:        null,
            username:       displayBlogTitle,
            namePrefix:     '',
            mediaCount:     null,
            followersCount: null,
            mediaLabel:     '게시물',
            followersLabel: '이웃',
          } : null}
        />
      </div>
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
              {renderSlot(s0, 'nb-0')}
              {renderSlot(s1, 'nb-1')}
              {renderSlot(s2, 'nb-2')}
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
