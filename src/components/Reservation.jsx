import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

const CAKE_OPTIONS = [
  '생일 케이크',
  '기념일 케이크',
  '웨딩 케이크',
  '돌잔치 케이크',
  '기타',
]

const SIZE_OPTIONS = ['미니 (4호)', '소 (5호)', '중 (6호)', '대 (7호 이상)']

export default function Reservation() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    pickupTime: '',
    cakeType: '',
    size: '',
    request: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = '이름을 입력해 주세요.'
    if (!form.phone.trim()) newErrors.phone = '연락처를 입력해 주세요.'
    if (!form.date) newErrors.date = '수령 날짜를 선택해 주세요.'
    if (!form.cakeType) newErrors.cakeType = '케이크 종류를 선택해 주세요.'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    // 실제 서비스에서는 API 호출로 교체하세요
    console.log('예약 정보:', form)
    setSubmitted(true)
  }

  const resetForm = () => {
    setForm({
      name: '',
      phone: '',
      date: '',
      pickupTime: '',
      cakeType: '',
      size: '',
      request: '',
    })
    setSubmitted(false)
    setErrors({})
  }

  // 오늘 이후 날짜만 선택 가능
  const today = new Date()
  today.setDate(today.getDate() + 3) // 최소 3일 전 주문
  const minDate = today.toISOString().split('T')[0]

  return (
    <section id="reservation" className="py-24 px-5 bg-brown-900">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <p className="text-center text-xs tracking-[0.3em] text-brown-400 uppercase mb-3">
          Cake Order
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-cream-50 text-center mb-3">
          케이크 예약
        </h2>
        <p className="text-center text-brown-400 text-sm mb-12 leading-relaxed">
          수령 3일 전까지 예약 부탁드립니다.
          <br />
          확인 후 연락드리겠습니다. (영업일 기준 1일 이내)
        </p>

        {submitted ? (
          /* 제출 완료 화면 */
          <div className="bg-brown-800 rounded-2xl p-10 text-center">
            <CheckCircle size={48} className="text-brown-400 mx-auto mb-5" />
            <h3 className="font-serif text-2xl text-cream-50 mb-3">
              예약 접수 완료!
            </h3>
            <p className="text-brown-400 text-sm leading-relaxed mb-8">
              <strong className="text-cream-200">{form.name}</strong>님, 예약해 주셔서 감사합니다.
              <br />
              입력하신 연락처({form.phone})로 확인 연락 드리겠습니다.
            </p>
            <button onClick={resetForm} className="btn-outline border-brown-400 text-brown-300 hover:bg-brown-700 hover:text-cream-50 hover:border-brown-600">
              새 예약 신청하기
            </button>
          </div>
        ) : (
          /* 예약 폼 */
          <form
            onSubmit={handleSubmit}
            className="bg-brown-800 rounded-2xl p-6 md:p-10 space-y-6"
          >
            {/* 이름 + 연락처 */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-brown-400 mb-2 tracking-wide">
                  이름 <span className="text-brown-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="홍길동"
                  className={`w-full bg-brown-900 text-cream-100 rounded-xl px-4 py-3 text-sm placeholder-brown-600 outline-none border transition-colors ${
                    errors.name ? 'border-red-400' : 'border-brown-700 focus:border-brown-400'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-brown-400 mb-2 tracking-wide">
                  연락처 <span className="text-brown-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                  className={`w-full bg-brown-900 text-cream-100 rounded-xl px-4 py-3 text-sm placeholder-brown-600 outline-none border transition-colors ${
                    errors.phone ? 'border-red-400' : 'border-brown-700 focus:border-brown-400'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* 수령 날짜 + 시간 */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-brown-400 mb-2 tracking-wide">
                  수령 날짜 <span className="text-brown-400">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  min={minDate}
                  onChange={handleChange}
                  className={`w-full bg-brown-900 text-cream-100 rounded-xl px-4 py-3 text-sm outline-none border transition-colors ${
                    errors.date ? 'border-red-400' : 'border-brown-700 focus:border-brown-400'
                  }`}
                />
                {errors.date && (
                  <p className="text-red-400 text-xs mt-1">{errors.date}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-brown-400 mb-2 tracking-wide">
                  수령 희망 시간
                </label>
                <input
                  type="time"
                  name="pickupTime"
                  value={form.pickupTime}
                  onChange={handleChange}
                  min="09:00"
                  max="18:00"
                  className="w-full bg-brown-900 text-cream-100 rounded-xl px-4 py-3 text-sm outline-none border border-brown-700 focus:border-brown-400 transition-colors"
                />
              </div>
            </div>

            {/* 케이크 종류 + 사이즈 */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-brown-400 mb-2 tracking-wide">
                  케이크 종류 <span className="text-brown-400">*</span>
                </label>
                <select
                  name="cakeType"
                  value={form.cakeType}
                  onChange={handleChange}
                  className={`w-full bg-brown-900 text-cream-100 rounded-xl px-4 py-3 text-sm outline-none border transition-colors ${
                    errors.cakeType ? 'border-red-400' : 'border-brown-700 focus:border-brown-400'
                  }`}
                >
                  <option value="">선택하세요</option>
                  {CAKE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {errors.cakeType && (
                  <p className="text-red-400 text-xs mt-1">{errors.cakeType}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-brown-400 mb-2 tracking-wide">
                  케이크 사이즈
                </label>
                <select
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  className="w-full bg-brown-900 text-cream-100 rounded-xl px-4 py-3 text-sm outline-none border border-brown-700 focus:border-brown-400 transition-colors"
                >
                  <option value="">선택하세요</option>
                  {SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 요청 사항 */}
            <div>
              <label className="block text-xs text-brown-400 mb-2 tracking-wide">
                요청 사항
              </label>
              <textarea
                name="request"
                value={form.request}
                onChange={handleChange}
                rows={4}
                placeholder="케이크 문구, 디자인, 알레르기 정보 등 전달하고 싶은 내용을 적어주세요."
                className="w-full bg-brown-900 text-cream-100 rounded-xl px-4 py-3 text-sm placeholder-brown-600 outline-none border border-brown-700 focus:border-brown-400 transition-colors resize-none"
              />
            </div>

            {/* 안내 */}
            <p className="text-xs text-brown-500 leading-relaxed">
              케이크 가격은 종류와 사이즈에 따라 다르며, 확인 연락 시 안내해 드립니다.
              예약금(5만원)은 확인 연락 후 계좌이체로 진행됩니다.
            </p>

            {/* 제출 버튼 */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-brown-500 text-white py-4 rounded-xl text-sm font-medium tracking-wide hover:bg-brown-400 transition-colors duration-300"
            >
              <Send size={16} />
              예약 신청하기
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
