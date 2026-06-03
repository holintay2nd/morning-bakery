import { useState, useEffect } from 'react'
import { Home, UtensilsCrossed, Sparkles, Share2, MapPin, Mail } from 'lucide-react'

const NAV_ITEMS = [
  { label: '홈',    Icon: Home,            href: '#home'          },
  { label: '메뉴',  Icon: UtensilsCrossed, href: '#about'         },
  { label: '추천',  Icon: Sparkles,        href: '#recommend'     },
  { label: '플랫폼', Icon: Share2,          href: '#sns-instagram' },
  { label: '정보',  Icon: MapPin,          href: '#visit'         },
  { label: '컨택',  Icon: Mail,            href: '#contact'       },
]

// 섹션 ID → 하단 탭 인덱스 매핑
const OBSERVE_MAP = [
  { id: 'home',          navIdx: 0 },
  { id: 'about',         navIdx: 1 },
  { id: 'recommend',     navIdx: 2 },
  { id: 'sns-instagram', navIdx: 3 },
  { id: 'sns-youtube',   navIdx: 3 },
  { id: 'sns-naverblog', navIdx: 3 },
  { id: 'sns-threads',   navIdx: 3 },
  { id: 'visit',         navIdx: 4 },
  { id: 'contact',       navIdx: 5 },
]

export default function BottomNav() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const observers = OBSERVE_MAP.map(({ id, navIdx }) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIdx(navIdx) },
        { threshold: 0.5 },
      )
      obs.observe(el)
      return obs
    }).filter(Boolean)

    return () => observers.forEach(obs => obs.disconnect())
  }, [])

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-[0_-2px_16px_rgba(0,0,0,0.06)]">
      <div
        className="flex items-center justify-around px-1 pt-2"
        style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
      >
        {NAV_ITEMS.map(({ label, Icon, href }, i) => {
          const isActive = i === activeIdx
          return (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className={`flex flex-col items-center gap-[3px] px-2 py-1 flex-1 transition-colors ${
                isActive ? 'text-brown-700' : 'text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
