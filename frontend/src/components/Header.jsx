import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

const SNS_SUB = [
  { label: 'Instagram',  href: '#sns-instagram' },
  { label: 'YouTube',    href: '#sns-youtube'   },
  { label: 'Naver Blog', href: '#sns-naverblog' },
  { label: 'Threads',    href: '#sns-threads'   },
]

const NAV = [
  { label: 'HOME',    href: '#home'      },
  { label: 'MENU',    href: '#about'     },
  { label: 'GUIDE',   href: '#recommend' },
  { label: 'SNS',     href: '#sns',    sub: SNS_SUB },
  { label: 'VISIT',   href: '#visit'     },
  { label: 'CONTACT', href: '#contact'   },
]

export default function Header() {
  const [isOpen,      setIsOpen]      = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const [snsHover,    setSnsHover]    = useState(false)
  const [mobileSnsOpen, setMobileSnsOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href) => {
    setIsOpen(false)
    setSnsHover(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const baseCls  = `text-sm tracking-widest font-medium transition-colors`
  const colorCls = scrolled ? 'text-brown-700 hover:text-brown-400' : 'text-white/90 hover:text-white'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-cream-50/95 backdrop-blur-sm shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">

        {/* 로고 */}
        <button onClick={() => scrollTo('#home')} className="flex flex-col leading-none text-left">
          <span className={`font-serif text-xl md:text-2xl tracking-wide transition-colors ${scrolled ? 'text-brown-800' : 'text-white'}`}>
            Morning Bakery
          </span>
          <span className={`text-xs tracking-widest transition-colors ${scrolled ? 'text-brown-400' : 'text-cream-200'}`}>
            모닝베이커리
          </span>
        </button>

        {/* 데스크탑 네비 */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((item) =>
            item.sub ? (
              /* SNS – 호버 드롭다운 */
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setSnsHover(true)}
                onMouseLeave={() => setSnsHover(false)}
              >
                <button
                  onClick={() => scrollTo(item.href)}
                  className={`${baseCls} ${colorCls} flex items-center gap-1`}
                >
                  {item.label}
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${snsHover ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* 드롭다운 패널 */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${
                    snsHover ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-xl py-2 min-w-[140px] overflow-hidden border border-gray-100">
                    {item.sub.map((s) => (
                      <button
                        key={s.href}
                        onClick={() => scrollTo(s.href)}
                        className="w-full text-left px-5 py-2.5 text-sm text-brown-700 hover:bg-cream-50 hover:text-brown-500 transition-colors"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className={`${baseCls} ${colorCls}`}
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        {/* 모바일 햄버거 */}
        <button
          className={`md:hidden transition-colors ${scrolled ? 'text-brown-700' : 'text-white'}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="메뉴 열기"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="bg-cream-50 border-t border-cream-200 px-5 py-4 flex flex-col gap-1">
          {NAV.map((item) =>
            item.sub ? (
              <div key={item.label}>
                <button
                  onClick={() => setMobileSnsOpen(!mobileSnsOpen)}
                  className="flex items-center justify-between w-full text-left text-brown-700 py-3 text-sm tracking-widest font-medium border-b border-cream-100 hover:text-brown-500 transition-colors"
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${mobileSnsOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${mobileSnsOpen ? 'max-h-48' : 'max-h-0'}`}>
                  {item.sub.map((s) => (
                    <button
                      key={s.href}
                      onClick={() => scrollTo(s.href)}
                      className="w-full text-left text-brown-500 pl-4 py-2.5 text-sm border-b border-cream-50 last:border-0 hover:text-brown-400 transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="text-left text-brown-700 py-3 text-sm tracking-widest font-medium border-b border-cream-100 last:border-0 hover:text-brown-500 transition-colors"
              >
                {item.label}
              </button>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
