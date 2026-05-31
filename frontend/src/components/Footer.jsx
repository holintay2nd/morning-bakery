import { Instagram, Heart, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const navLinks = [
  { label: '홈',        href: '#home'      },
  { label: '메뉴',      href: '#about'     },
  { label: '방문 가이드', href: '#recommend' },
  { label: 'SNS',       href: '#sns'       },
  { label: '매장 정보',  href: '#visit'     },
  { label: '문의',       href: '#contact'   },
]

export default function Footer() {
  const navigate = useNavigate()

  const handleScroll = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-brown-900 text-brown-400 py-16 px-5 border-t border-brown-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">

          {/* 브랜드 */}
          <div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-left mb-4"
            >
              <p className="font-serif text-2xl text-cream-100">Morning Bakery</p>
              <p className="text-xs tracking-widest text-brown-500 mt-0.5">모닝베이커리</p>
            </button>
            <p className="text-sm leading-relaxed text-brown-500">
              매일 새벽 5시, 오늘의 빵을 굽기 시작합니다.
              <br />
              신선함을 가장 중요하게 생각하는
              <br />
              서울의 작은 베이커리입니다.
            </p>
          </div>

          {/* 사이트맵 */}
          <div>
            <h4 className="text-xs tracking-widest text-brown-500 uppercase mb-4">Site</h4>
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
            <ul className="space-y-3 text-sm text-brown-500">
              <li className="leading-relaxed">
                서울특별시 마포구 노고산동 107-17
                <br />
                <span className="text-xs text-brown-600">홍대입구역 2번 출구 도보 5분</span>
              </li>
              <li>
                <a href="tel:02-000-0000" className="hover:text-cream-200 transition-colors">
                  02-000-0000
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@morningbakery.kr"
                  className="hover:text-cream-200 transition-colors"
                >
                  hello@morningbakery.kr
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram size={14} />
                <a
                  href="https://instagram.com/morning_bakery_seoul"
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

        {/* 하단 바 */}
        <div className="border-t border-brown-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brown-600">© 2025 Morning Bakery. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-brown-600 flex items-center gap-1">
              Made with <Heart size={10} className="text-brown-500" /> in Seoul
            </p>
            <button
              onClick={() => navigate('/admin/login')}
              className="flex items-center gap-1.5 text-xs text-brown-700 hover:text-brown-500 transition-colors"
            >
              <Lock size={11} />
              관리자
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
