import { useState } from 'react'
import { Clock, Bell, Car, Copy, Check } from 'lucide-react'

const ADDRESS = '서울특별시 마포구 노고산동 107-17'

const MAP_LINKS = {
  naver:  `https://map.naver.com/v5/search/${encodeURIComponent(ADDRESS)}`,
  kakao:  `https://map.kakao.com/link/search/${encodeURIComponent(ADDRESS)}`,
  google: `https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`,
}

const hours = [
  { day: '월요일 — 금요일', time: '07:00 — 19:00' },
  { day: '토요일',         time: '08:00 — 18:00' },
  { day: '일요일',         time: '08:00 — 16:00' },
]

export default function VisitSection() {
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(ADDRESS).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section id="visit" className="py-24 px-5 bg-brown-900">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs tracking-[0.3em] text-brown-400 uppercase mb-3">Visit</p>
        <h2 className="font-sans font-bold text-3xl md:text-4xl text-cream-50 text-center mb-14">매장 정보</h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* 지도 플레이스홀더 + 위치 */}
          <div className="rounded-2xl overflow-hidden shadow-sm bg-brown-800">
            {/* 지도 비주얼 */}
            <div className="h-64 flex items-center justify-center relative">
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
              <div className="relative z-10 flex flex-col items-center gap-3 px-8 text-center">
                <div className="w-14 h-14 rounded-full bg-[#03C75A]/20 border-2 border-[#03C75A]/40 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-[#03C75A] flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-cream-200 font-medium text-sm">홍대입구역 2번 출구 도보 5분</p>
              </div>
            </div>

            {/* 주소 + 지도 버튼 */}
            <div className="p-6 border-t border-brown-700">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-cream-200 text-sm font-medium flex-1 leading-snug">{ADDRESS}</p>
                <button
                  onClick={copyAddress}
                  aria-label="주소 복사"
                  className="flex items-center gap-1 text-xs shrink-0 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">복사됨</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="text-brown-400 hover:text-brown-200" />
                      <span className="text-brown-400 hover:text-brown-200">복사</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* 네이버 지도 */}
                <a
                  href={MAP_LINKS.naver}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="네이버 지도로 열기"
                  className="flex items-center gap-1.5 bg-[#03C75A] text-white text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-[#02b351] transition-colors shadow-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white" aria-hidden="true">
                    <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/>
                  </svg>
                  네이버 지도
                </a>

                {/* 카카오맵 */}
                <a
                  href={MAP_LINKS.kakao}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="카카오맵으로 열기"
                  className="flex items-center gap-1.5 bg-[#FEE500] text-[#3C1E1E] text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-[#FFD900] transition-colors shadow-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#3C1E1E]" aria-hidden="true">
                    <path d="M12 3C7.37 3 3.5 6.32 3.5 10.41c0 2.6 1.5 4.9 3.77 6.3l-.84 3.06c-.06.22.21.39.4.27l3.69-2.27c.47.07.95.1 1.48.1 4.63 0 8.5-3.32 8.5-7.46S16.63 3 12 3z"/>
                  </svg>
                  카카오맵
                </a>

                {/* 구글 지도 */}
                <a
                  href={MAP_LINKS.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="구글 지도로 열기"
                  className="flex items-center gap-1.5 bg-white/90 text-brown-800 text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-white transition-colors shadow-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3" aria-hidden="true">
                    <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5" fill="white"/>
                  </svg>
                  구글 지도
                </a>
              </div>
            </div>
          </div>

          {/* 정보 카드 */}
          <div className="space-y-6">
            {/* 공지사항 */}
            <div className="bg-brown-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-brown-700 p-3 rounded-full shrink-0">
                  <Bell size={20} className="text-brown-300" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-cream-50 text-lg mb-2">공지사항</h3>
                  <p className="text-brown-300 text-sm leading-relaxed">
                    매일 새벽 5시부터 빵을 굽기 시작합니다.
                    <br />
                    재료 소진 시 당일 조기 마감될 수 있으니 방문 전 SNS를 확인해 주세요.
                  </p>
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

            {/* 주차 */}
            <div className="bg-brown-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-brown-700 p-3 rounded-full shrink-0">
                  <Car size={20} className="text-brown-300" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-cream-50 text-lg mb-2">주차</h3>
                  <p className="text-brown-300 text-sm leading-relaxed">
                    건물 내 주차장 이용 가능 (최대 1시간 무료)
                    <br />
                    이후 30분당 2,000원이 부과됩니다.
                  </p>
                  <p className="mt-2 text-xs text-brown-500">
                    * 주말 및 공휴일에는 주차 공간이 협소할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
