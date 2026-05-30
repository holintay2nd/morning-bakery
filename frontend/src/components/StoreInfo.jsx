import { MapPin, Clock, Phone, Instagram } from 'lucide-react'

const hours = [
  { day: '월요일 — 금요일', time: '07:00 — 19:00' },
  { day: '토요일', time: '08:00 — 18:00' },
  { day: '일요일', time: '08:00 — 16:00' },
]

export default function StoreInfo() {
  return (
    <section id="store" className="py-24 px-5 bg-brown-900 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* 섹션 헤더 — 다크 배경에 맞게 색상 오버라이드 */}
        <p className="text-center text-xs tracking-[0.3em] text-brown-400 uppercase mb-3">
          Contact
        </p>
        <h2 className="font-sans font-bold text-3xl md:text-4xl text-cream-50 text-center mb-14">
          매장 안내
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* 지도 — 네이버 지도 플레이스홀더 */}
          <div className="rounded-2xl overflow-hidden shadow-sm h-80 md:h-full min-h-[320px] bg-brown-800 flex items-center justify-center relative">
            {/* 배경 격자 */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: [
                  'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
                  'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                ].join(', '),
                backgroundSize: '36px 36px',
              }}
            />
            {/* 중앙 콘텐츠 */}
            <div className="relative z-10 flex flex-col items-center gap-5 px-8 text-center">
              {/* 핀 */}
              <div className="w-16 h-16 rounded-full bg-[#03C75A]/20 border-2 border-[#03C75A]/40 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#03C75A] flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-cream-200 font-medium text-sm mb-1">서울특별시 마포구 노고산동 107-17</p>
                <p className="text-brown-400 text-xs">홍대입구역 2번 출구 도보 5분</p>
              </div>
              <a
                href="https://map.naver.com/v5/search/서울특별시+마포구+노고산동+107-17"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#03C75A] text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[#02b351] transition-colors shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" aria-hidden="true">
                  <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/>
                </svg>
                네이버 지도로 보기
              </a>
            </div>
          </div>

          {/* 정보 카드 */}
          <div className="space-y-6">
            {/* 주소 */}
            <div className="bg-brown-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-brown-700 p-3 rounded-full shrink-0">
                  <MapPin size={20} className="text-brown-300" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-cream-50 text-lg mb-1">위치</h3>
                  <p className="text-brown-300 text-sm leading-relaxed">
                    서울특별시 마포구 노고산동 107-17
                    <br />
                    (홍대입구역 2번 출구에서 도보 5분)
                  </p>
                  <a
                    href="https://map.naver.com/v5/search/서울특별시+마포구+노고산동+107-17"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-xs text-brown-400 border border-brown-600 px-4 py-1.5 rounded-full hover:bg-brown-700 hover:text-brown-200 transition-colors"
                  >
                    네이버 지도로 열기 →
                  </a>
                </div>
              </div>
            </div>

            {/* 운영 시간 */}
            <div className="bg-brown-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-brown-700 p-3 rounded-full shrink-0">
                  <Clock size={20} className="text-brown-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-sans font-bold text-cream-50 text-lg mb-3">운영 시간</h3>
                  <ul className="space-y-2">
                    {hours.map((h) => (
                      <li key={h.day} className="flex justify-between text-sm">
                        <span className="text-brown-400">{h.day}</span>
                        <span className="text-cream-200 font-medium">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-brown-500 border-t border-brown-700 pt-3 leading-relaxed">
                    * 빵이 모두 소진되면 조기 마감될 수 있습니다.
                    <br />
                    * 공휴일 운영 시간은 인스타그램을 확인해 주세요.
                  </p>
                </div>
              </div>
            </div>

            {/* 연락처 */}
            <div className="bg-brown-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-brown-700 p-3 rounded-full shrink-0">
                  <Phone size={20} className="text-brown-300" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-cream-50 text-lg mb-1">연락처</h3>
                  <a
                    href="tel:02-000-0000"
                    className="text-cream-200 text-sm hover:text-brown-300 transition-colors"
                  >
                    02-000-0000
                  </a>
                  <div className="flex items-center gap-2 mt-3">
                    <Instagram size={16} className="text-brown-400" />
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brown-400 text-sm hover:text-brown-200 transition-colors"
                    >
                      @morning_bakery_seoul
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
