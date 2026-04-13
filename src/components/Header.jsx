import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navItems = [
  { label: '홈', href: '#home' },
  { label: '메뉴', href: '#menu' },
  { label: '매장 안내', href: '#store' },
  { label: '예약 문의', href: '#reservation' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href) => {
    setIsOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-50/95 backdrop-blur-sm shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
        {/* 로고 */}
        <button
          onClick={() => handleNavClick('#home')}
          className="flex flex-col leading-none text-left"
        >
          <span
            className={`font-serif text-xl md:text-2xl tracking-wide transition-colors ${
              scrolled ? 'text-brown-800' : 'text-white'
            }`}
          >
            Morning Bakery
          </span>
          <span
            className={`text-xs tracking-widest transition-colors ${
              scrolled ? 'text-brown-400' : 'text-cream-200'
            }`}
          >
            모닝베이커리
          </span>
        </button>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`text-sm tracking-wide transition-colors hover:text-brown-400 ${
                scrolled ? 'text-brown-700' : 'text-white/90'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('#reservation')}
            className={`text-sm px-5 py-2 rounded-full border transition-all duration-300 ${
              scrolled
                ? 'border-brown-600 text-brown-600 hover:bg-brown-600 hover:text-white'
                : 'border-white text-white hover:bg-white hover:text-brown-700'
            }`}
          >
            케이크 예약
          </button>
        </nav>

        {/* 모바일 햄버거 */}
        <button
          className={`md:hidden transition-colors ${
            scrolled ? 'text-brown-700' : 'text-white'
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="메뉴 열기"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="bg-cream-50 border-t border-cream-200 px-5 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="text-left text-brown-700 py-3 text-sm border-b border-cream-100 last:border-0 hover:text-brown-500 transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('#reservation')}
            className="mt-3 btn-primary text-center w-full"
          >
            케이크 예약
          </button>
        </nav>
      </div>
    </header>
  )
}
