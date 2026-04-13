import { Instagram, Heart } from 'lucide-react'

const navLinks = [
  { label: '홈', href: '#home' },
  { label: '메뉴', href: '#menu' },
  { label: '매장 안내', href: '#store' },
  { label: '케이크 예약', href: '#reservation' },
]

export default function Footer() {
  const handleScroll = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-brown-900 text-brown-400 py-16 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* 브랜드 */}
          <div>
            <button onClick={scrollToTop} className="text-left mb-4">
              <p className="font-serif text-2xl text-cream-100">Morning Bakery</p>
              <p className="text-xs tracking-widest text-brown-500 mt-0.5">모닝베이커리</p>
            </button>
            <p className="text-sm leading-relaxed text-brown-500">
              매일 새벽부터 정성껏 빵을 굽는
              <br />
              서울의 작은 베이커리 카페입니다.
            </p>
          </div>

          {/* 링크 */}
          <div>
            <h4 className="text-xs tracking-widest text-brown-500 uppercase mb-4">Menu</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleScroll(link.href)}
                    className="text-sm text-brown-400 hover:text-cream-200 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="text-xs tracking-widest text-brown-500 uppercase mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-brown-500">
              <li>서울특별시 마포구 홍익로 00길 00</li>
              <li>
                <a href="tel:02-000-0000" className="hover:text-cream-200 transition-colors">
                  02-000-0000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram size={14} />
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream-200 transition-colors"
                >
                  @morning_bakery_seoul
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-brown-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brown-600">
            © 2024 Morning Bakery. All rights reserved.
          </p>
          <p className="text-xs text-brown-600 flex items-center gap-1">
            Made with <Heart size={10} className="text-brown-500" /> in Seoul
          </p>
        </div>
      </div>
    </footer>
  )
}
