import { Phone, Mail } from 'lucide-react'

export default function ContactSection() {
  return (
    <section id="contact" className="mobile-snap-section py-24 px-5 bg-brown-800 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs tracking-[0.3em] text-brown-400 uppercase mb-3">Contact</p>
        <h2 className="font-sans font-bold text-3xl md:text-4xl text-cream-50 text-center mb-14">문의</h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* 전화 */}
          <div className="bg-brown-700 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="bg-brown-600 p-3 rounded-full w-fit">
              <Phone size={20} className="text-brown-300" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-cream-50 text-lg mb-2">전화</h3>
              <a
                href="tel:02-000-0000"
                className="text-cream-200 text-sm hover:text-brown-300 transition-colors block mb-1"
              >
                02-000-0000
              </a>
              <p className="text-brown-400 text-xs leading-relaxed">운영 시간 내 연결 가능합니다.</p>
            </div>
          </div>

          {/* 카카오채널 */}
          <div className="bg-brown-700 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="bg-brown-600 p-3 rounded-full w-fit">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FEE500]" aria-hidden="true">
                <path d="M12 3C7.37 3 3.5 6.32 3.5 10.41c0 2.6 1.5 4.9 3.77 6.3l-.84 3.06c-.06.22.21.39.4.27l3.69-2.27c.47.07.95.1 1.48.1 4.63 0 8.5-3.32 8.5-7.46S16.63 3 12 3z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-sans font-bold text-cream-50 text-lg mb-2">카카오채널</h3>
              <a
                href="https://pf.kakao.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FEE500] text-[#3C1E1E] font-semibold text-xs px-4 py-2 rounded-full hover:bg-[#FFD900] transition-colors shadow-sm mb-2"
              >
                채널 추가하기
              </a>
              <p className="text-brown-400 text-xs leading-relaxed">빠른 답변을 원하신다면 카카오채널을 이용해 주세요.</p>
            </div>
          </div>

          {/* 이메일 */}
          <div className="bg-brown-700 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="bg-brown-600 p-3 rounded-full w-fit">
              <Mail size={20} className="text-brown-300" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-cream-50 text-lg mb-2">이메일</h3>
              <a
                href="mailto:hello@morningbakery.kr"
                className="text-cream-200 text-sm hover:text-brown-300 transition-colors block mb-1"
              >
                hello@morningbakery.kr
              </a>
              <p className="text-brown-400 text-xs leading-relaxed">이메일 문의는 1–2일 내로 답변 드립니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
