import { useState, useEffect } from 'react'
import {
  ChevronDown, AlignJustify, ChevronLeft, ChevronRight, Check,
  Home, UtensilsCrossed, Sparkles, MapPin, Mail,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'home',          label: '홈',            href: '#home'          },
  { id: 'about',         label: '메뉴',          href: '#about'         },
  { id: 'recommend',     label: '추천',          href: '#recommend'     },
  { id: 'sns-instagram', label: '인스타그램',    href: '#sns-instagram' },
  { id: 'sns-youtube',   label: '유튜브',        href: '#sns-youtube'   },
  { id: 'sns-naverblog', label: '네이버 블로그', href: '#sns-naverblog' },
  { id: 'sns-threads',   label: '스레드',        href: '#sns-threads'   },
  { id: 'visit',         label: '이용 안내',     href: '#visit'         },
  { id: 'contact',       label: '연락',          href: '#contact'       },
]

const SITEMAP_GROUPS = [
  { group: '빵집 안내', ids: ['home', 'about', 'recommend', 'visit', 'contact']                       },
  { group: 'SNS 채널',  ids: ['sns-instagram', 'sns-youtube', 'sns-naverblog', 'sns-threads']          },
]

const CIRCLE_CLS = {
  home:            'bg-amber-50 text-amber-600',
  about:           'bg-orange-50 text-orange-600',
  recommend:       'bg-yellow-50 text-yellow-600',
  'sns-instagram': 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white',
  'sns-youtube':   'bg-red-500 text-white',
  'sns-naverblog': 'bg-green-500 text-white',
  'sns-threads':   'bg-gray-900 text-white',
  visit:           'bg-blue-50 text-blue-600',
  contact:         'bg-gray-100 text-gray-600',
}

function SectionIcon({ id }) {
  const svgCls = 'w-3.5 h-3.5 fill-current'
  switch (id) {
    case 'home':          return <Home size={14} />
    case 'about':         return <UtensilsCrossed size={14} />
    case 'recommend':     return <Sparkles size={14} />
    case 'visit':         return <MapPin size={14} />
    case 'contact':       return <Mail size={14} />
    case 'sns-instagram': return (
      <svg viewBox="0 0 24 24" className={svgCls} aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
    case 'sns-youtube': return (
      <svg viewBox="0 0 24 24" className={svgCls} aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
    case 'sns-naverblog': return (
      <svg viewBox="0 0 24 24" className={svgCls} aria-hidden="true">
        <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/>
      </svg>
    )
    case 'sns-threads': return (
      <svg viewBox="0 0 24 24" className={svgCls} aria-hidden="true">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z"/>
      </svg>
    )
    default: return null
  }
}

function SectionCircle({ id }) {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${CIRCLE_CLS[id] ?? 'bg-gray-100 text-gray-500'}`}>
      <SectionIcon id={id} />
    </div>
  )
}

export default function MobileTopNav() {
  const [isAtHome,    setIsAtHome]    = useState(true)
  const [activeId,    setActiveId]    = useState('home')
  const [sheetOpen,   setSheetOpen]   = useState(false)
  const [sitemapOpen, setSitemapOpen] = useState(false)

  // 스크롤 기반 active section 추적 — IntersectionObserver 대신 사용
  // snap 컨테이너의 overflow:scroll 환경에서 더 신뢰도 높음
  useEffect(() => {
    const container = document.querySelector('.mobile-snap-container')
    if (!container) return

    const update = () => {
      const mid = window.innerHeight / 2
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id)
        if (!el) continue
        const { top, bottom } = el.getBoundingClientRect()
        if (top <= mid && mid < bottom) {
          setIsAtHome(id === 'home')
          setActiveId(id)
          return
        }
      }
    }

    container.addEventListener('scroll', update, { passive: true })
    update()
    return () => container.removeEventListener('scroll', update)
  }, [])

  // Close panels on Escape
  useEffect(() => {
    if (!sheetOpen && !sitemapOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') { setSheetOpen(false); setSitemapOpen(false) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [sheetOpen, sitemapOpen])

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    setSheetOpen(false)
    setSitemapOpen(false)
  }

  const activeItem = NAV_ITEMS.find(n => n.id === activeId)

  return (
    <>
      {/* ── Fixed Top Navbar ── */}
      <header
        className={`md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-transform duration-300 ease-in-out ${isAtHome ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div
          className="relative flex items-center justify-between px-4 h-[52px]"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          {/* 좌측: 브랜드 로고 (두 줄) */}
          <button
            onClick={() => scrollTo('#home')}
            className="flex flex-col leading-none text-left active:opacity-70 transition-opacity"
            aria-label="홈으로 이동"
          >
            <span className="font-serif text-[15px] tracking-wide text-brown-800">Morning</span>
            <span className="font-serif text-[15px] tracking-wide italic text-brown-300">Bakery</span>
          </button>

          {/* 가운데: 절대 중앙 정렬 — 현재 섹션 이름 + 아래 화살표 */}
          <div className="absolute inset-x-0 flex justify-center pointer-events-none">
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-1 text-brown-800 active:opacity-70 transition-opacity pointer-events-auto"
              aria-label="네비게이션 메뉴 열기"
            >
              <span className="text-[13px] font-semibold leading-none">{activeItem?.label}</span>
              <ChevronDown size={12} strokeWidth={2.5} className="text-brown-500 mt-px" />
            </button>
          </div>

          {/* 우측: 전체 사이트맵 */}
          <button
            onClick={() => setSitemapOpen(true)}
            className="text-brown-700 active:opacity-70 transition-opacity p-1 -mr-1"
            aria-label="전체 메뉴"
          >
            <AlignJustify size={22} strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/* ── 하단 네비 시트 ── */}
      <div
        aria-hidden={!sheetOpen}
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${sheetOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setSheetOpen(false)} />
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${sheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
          style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
        >
          {/* 드래그 핸들 */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-9 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* 네비 리스트 */}
          <div className="overflow-y-auto" style={{ maxHeight: '75svh' }}>
            {NAV_ITEMS.map(({ id, label, href }) => (
              <button
                key={id}
                onClick={() => scrollTo(href)}
                className="flex items-center gap-3 w-full px-5 py-3.5 active:bg-gray-50 transition-colors"
              >
                <SectionCircle id={id} />
                <span className={`flex-1 text-left text-[15px] ${id === activeId ? 'font-bold text-brown-800' : 'font-medium text-gray-800'}`}>
                  {label}
                </span>
                {id === activeId && (
                  <Check size={18} strokeWidth={2.5} className="text-blue-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 사이트맵 패널 (우측 스와이프) ── */}
      <div
        aria-hidden={!sitemapOpen}
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${sitemapOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setSitemapOpen(false)} />
        <div
          className={`absolute top-0 right-0 bottom-0 w-full bg-gray-50 shadow-2xl transition-transform duration-300 ease-out ${sitemapOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          {/* 헤더 */}
          <div className="flex items-center px-4 h-[52px] border-b border-gray-200 bg-white">
            <button
              onClick={() => setSitemapOpen(false)}
              className="p-1 -ml-1 text-brown-700 active:opacity-70 transition-opacity"
              aria-label="닫기"
            >
              <ChevronLeft size={24} strokeWidth={2} />
            </button>
            <h2 className="flex-1 text-center text-[17px] font-bold text-gray-900 pr-8">전체 메뉴</h2>
          </div>

          {/* 사이트맵 컨텐츠 */}
          <div
            className="overflow-y-auto"
            style={{ height: 'calc(100% - 52px)', paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
          >
            {SITEMAP_GROUPS.map(({ group, ids }) => (
              <div key={group} className="mt-8">
                <p className="px-5 text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-1">
                  {group}
                </p>
                <div className="bg-white border-y border-gray-200">
                  {ids.map((id, i) => {
                    const item = NAV_ITEMS.find(n => n.id === id)
                    if (!item) return null
                    return (
                      <button
                        key={id}
                        onClick={() => scrollTo(item.href)}
                        className={`flex items-center w-full px-5 py-4 active:bg-gray-50 transition-colors ${i < ids.length - 1 ? 'border-b border-gray-100' : ''}`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <SectionCircle id={id} />
                          <span className="text-[15px] font-medium text-gray-900">{item.label}</span>
                        </div>
                        <ChevronRight size={16} strokeWidth={2} className="text-gray-300 flex-shrink-0" />
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
