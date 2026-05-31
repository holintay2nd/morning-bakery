import { useState } from 'react'
import { MapPin, Clock, Car, Bell, Copy, Check } from 'lucide-react'

const ADDRESS   = '서울특별시 마포구 노고산동 107-17'
const EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&t=&z=16&ie=UTF8&iwloc=&output=embed`

const MAP_LINKS = {
  naver:  `https://map.naver.com/v5/search/${encodeURIComponent(ADDRESS)}`,
  kakao:  `https://map.kakao.com/link/search/${encodeURIComponent(ADDRESS)}`,
  google: `https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`,
}

const hours = [
  { day: '월 — 금', time: '07:00 — 19:00' },
  { day: '토요일',  time: '08:00 — 18:00' },
  { day: '일요일',  time: '08:00 — 16:00' },
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

          {/* ── 왼쪽: 구글 지도 ── */}
          <div className="rounded-2xl overflow-hidden h-[340px] md:h-full md:min-h-[520px] shadow-sm">
            <iframe
              title="모닝베이커리 위치"
              src={EMBED_URL}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          {/* ── 오른쪽: 정보 패널 ── */}
          <div className="space-y-4">

            {/* 위치 */}
            <div className="bg-brown-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={15} className="text-brown-400" />
                <span className="text-xs text-brown-400 tracking-widest uppercase">Location</span>
              </div>
              <p className="text-cream-50 font-semibold text-sm leading-snug mb-0.5">{ADDRESS}</p>
              <p className="text-brown-400 text-xs mb-5">홍대입구역 2번 출구 도보 5분</p>

              {/* 지도 바로가기 + 복사 */}
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={MAP_LINKS.naver}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="네이버 지도"
                  className="flex items-center gap-1.5 bg-[#03C75A] text-white text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-[#02b351] transition-colors shadow-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white" aria-hidden="true">
                    <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/>
                  </svg>
                  네이버
                </a>
                <a
                  href={MAP_LINKS.kakao}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="카카오맵"
                  className="flex items-center gap-1.5 bg-[#FEE500] text-[#3C1E1E] text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-[#FFD900] transition-colors shadow-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#3C1E1E]" aria-hidden="true">
                    <path d="M12 3C7.37 3 3.5 6.32 3.5 10.41c0 2.6 1.5 4.9 3.77 6.3l-.84 3.06c-.06.22.21.39.4.27l3.69-2.27c.47.07.95.1 1.48.1 4.63 0 8.5-3.32 8.5-7.46S16.63 3 12 3z"/>
                  </svg>
                  카카오
                </a>
                <a
                  href={MAP_LINKS.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="구글 지도"
                  className="flex items-center gap-1.5 bg-white/90 text-brown-800 text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-white transition-colors shadow-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3" aria-hidden="true">
                    <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5" fill="white"/>
                  </svg>
                  구글
                </a>
                <button
                  onClick={copyAddress}
                  aria-label="주소 복사"
                  className="flex items-center gap-1.5 bg-brown-700 text-xs px-3.5 py-2 rounded-full hover:bg-brown-600 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">복사됨</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} className="text-brown-400" />
                      <span className="text-brown-300">주소 복사</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 운영 시간 */}
            <div className="bg-brown-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={15} className="text-brown-400" />
                <span className="text-xs text-brown-400 tracking-widest uppercase">Hours</span>
              </div>
              <ul className="space-y-3">
                {hours.map((h) => (
                  <li key={h.day} className="flex items-center justify-between text-sm">
                    <span className="text-brown-400">{h.day}</span>
                    <span className="text-cream-200 font-semibold tabular-nums">{h.time}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 pt-4 border-t border-brown-700 text-xs text-brown-500 leading-relaxed">
                빵 소진 시 조기 마감 · 공휴일 운영시간은 SNS를 확인해 주세요.
              </p>
            </div>

            {/* 주차 + 공지사항 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brown-800 rounded-2xl p-5">
                <Car size={18} className="text-brown-400 mb-3" />
                <p className="text-cream-50 text-sm font-semibold mb-1.5">주차</p>
                <p className="text-brown-400 text-xs leading-relaxed">
                  건물 내 주차 가능
                  <br />
                  최대 1시간 무료
                </p>
              </div>
              <div className="bg-brown-800 rounded-2xl p-5">
                <Bell size={18} className="text-brown-400 mb-3" />
                <p className="text-cream-50 text-sm font-semibold mb-1.5">공지사항</p>
                <p className="text-brown-400 text-xs leading-relaxed">
                  매일 새벽 5시
                  <br />
                  베이킹 시작
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 이용 가이드 */}
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: '📸',
              title: '사진 촬영',
              desc: '창가 자리에서 자연광과 함께 촬영하면 가장 예쁘게 담을 수 있습니다.',
            },
            {
              icon: '🍰',
              title: '디저트 추천',
              desc: '버터 크루아상과 시즌 음료 조합이 가장 인기 있습니다.',
            },
            {
              icon: '💻',
              title: '작업 이용',
              desc: '2층 창가 좌석은 콘센트 이용이 가능하며 비교적 조용합니다.',
            },
            {
              icon: '❤️',
              title: '데이트 방문',
              desc: '창가 2인석은 미리 방문해 확보하시길 권장드립니다.',
            },
          ].map((tip) => (
            <div key={tip.title} className="bg-brown-800 rounded-2xl p-5">
              <span className="text-2xl mb-3 block">{tip.icon}</span>
              <p className="text-cream-100 text-sm font-semibold mb-2">{tip.title}</p>
              <p className="text-brown-400 text-xs leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
