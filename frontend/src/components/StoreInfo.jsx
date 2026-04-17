import { MapPin, Clock, Phone, Instagram } from 'lucide-react'

const hours = [
  { day: '월요일 — 금요일', time: '07:00 — 19:00' },
  { day: '토요일', time: '08:00 — 18:00' },
  { day: '일요일', time: '08:00 — 16:00' },
]

export default function StoreInfo() {
  return (
    <section id="store" className="py-24 px-5 bg-cream-50">
      <div className="max-w-6xl mx-auto">
        <p className="section-subtitle">Find Us</p>
        <h2 className="section-title mb-14">매장 안내</h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* 지도 */}
          <div className="rounded-2xl overflow-hidden shadow-sm h-80 md:h-full min-h-[320px] bg-cream-200">
            <iframe
              title="모닝베이커리 위치"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.5596707088!2d126.9218789!3d37.5519738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c98d04048f3b7%3A0xb84f0c7a93e5e1c!2z7Iol6rWs7Ja066qF7ZSE6rCV!5e0!3m2!1sko!2skr!4v1712980000000!5m2!1sko!2skr"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '320px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* 정보 카드 */}
          <div className="space-y-6">
            {/* 주소 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-cream-100 p-3 rounded-full shrink-0">
                  <MapPin size={20} className="text-brown-500" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-brown-800 text-lg mb-1">위치</h3>
                  <p className="text-brown-500 text-sm leading-relaxed">
                    서울특별시 마포구 홍익로 00길 00
                    <br />
                    (홍대입구역 2번 출구에서 도보 5분)
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-xs text-brown-400 border border-brown-300 px-4 py-1.5 rounded-full hover:bg-brown-50 transition-colors"
                  >
                    지도 앱으로 열기 →
                  </a>
                </div>
              </div>
            </div>

            {/* 운영 시간 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-cream-100 p-3 rounded-full shrink-0">
                  <Clock size={20} className="text-brown-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-sans font-bold text-brown-800 text-lg mb-3">운영 시간</h3>
                  <ul className="space-y-2">
                    {hours.map((h) => (
                      <li key={h.day} className="flex justify-between text-sm">
                        <span className="text-brown-500">{h.day}</span>
                        <span className="text-brown-700 font-medium">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-brown-300 border-t border-cream-100 pt-3">
                    * 빵이 모두 소진되면 조기 마감될 수 있습니다.
                    <br />
                    * 공휴일 운영 시간은 인스타그램을 확인해 주세요.
                  </p>
                </div>
              </div>
            </div>

            {/* 연락처 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-cream-100 p-3 rounded-full shrink-0">
                  <Phone size={20} className="text-brown-500" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-brown-800 text-lg mb-1">연락처</h3>
                  <a
                    href="tel:02-000-0000"
                    className="text-brown-600 text-sm hover:text-brown-400 transition-colors"
                  >
                    02-000-0000
                  </a>
                  <div className="flex items-center gap-2 mt-3">
                    <Instagram size={16} className="text-brown-400" />
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brown-400 text-sm hover:text-brown-600 transition-colors"
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
