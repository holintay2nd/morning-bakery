import { useState } from 'react'

const PURPOSES = [
  {
    emoji: '❤️',
    label: '연인과',
    title: '연인과 방문 예정이라면',
    desc: '분위기 있는 공간에서 특별한 시간을 보내고 싶은 분들께',
    items: [
      { icon: '🥐', category: '추천 메뉴', text: '크루아상 2종 + 시즌 라떼 세트' },
      { icon: '🪑', category: '추천 좌석', text: '창가 2인석 — 자연광이 가장 예쁜 자리' },
      { icon: '🕙', category: '추천 시간', text: '평일 오전 10–12시 (여유로운 분위기)' },
      { icon: '📸', category: '포토존',    text: '창가 테이블, 빵 진열대 앞' },
    ],
  },
  {
    emoji: '📸',
    label: '사진 촬영',
    title: '사진 촬영이 목적이라면',
    desc: '예쁜 사진을 남기고 싶은 분들께 최적의 조건을 안내합니다',
    items: [
      { icon: '🥐', category: '추천 메뉴', text: '크루아상 · 타르트 (비주얼이 가장 좋은 메뉴)' },
      { icon: '🪑', category: '추천 좌석', text: '1층 창가 좌석 — 자연광 최적화' },
      { icon: '🕙', category: '추천 시간', text: '오전 9–11시 (빛이 가장 예쁜 골든아워)' },
      { icon: '📍', category: '포토존',    text: '창가 테이블, 진열대 앞, 벽돌 벽 배경' },
    ],
  },
  {
    emoji: '💻',
    label: '작업 목적',
    title: '작업이 목적이라면',
    desc: '조용한 환경에서 집중하고 싶은 분들을 위한 안내입니다',
    items: [
      { icon: '☕', category: '추천 메뉴', text: '아메리카노 + 스콘 (장시간 이용에 적합)' },
      { icon: '🪑', category: '추천 좌석', text: '2층 창가석 — 콘센트 이용 가능 · 조용함' },
      { icon: '🕙', category: '추천 시간', text: '평일 오후 2–5시 (가장 한산한 시간대)' },
      { icon: '📶', category: '편의 시설', text: '와이파이 무료 · 콘센트 완비' },
    ],
  },
  {
    emoji: '👥',
    label: '친구들과',
    title: '친구들과 방문한다면',
    desc: '여럿이 함께 즐길 수 있는 공간과 메뉴를 추천드립니다',
    items: [
      { icon: '🥐', category: '추천 메뉴', text: '빵 쉐어링 플레이트 + 각자 드링크' },
      { icon: '🪑', category: '추천 좌석', text: '4인 테이블 — 미리 방문 시 확보 권장' },
      { icon: '🕙', category: '추천 시간', text: '평일 오전 · 주말 오후 2시 이후' },
      { icon: '📍', category: '단체 포토', text: '입구 앞 포토 포인트, 계단 배경' },
    ],
  },
  {
    emoji: '☕',
    label: '혼자 여유롭게',
    title: '혼자 조용히 쉬고 싶다면',
    desc: '재즈 음악과 자연광 속에서 온전히 나만의 시간을',
    items: [
      { icon: '☕', category: '추천 메뉴', text: '시즌 라떼 + 크루아상' },
      { icon: '🪑', category: '추천 좌석', text: '창가 1인석 — 독립적인 공간감' },
      { icon: '🕙', category: '추천 시간', text: '평일 오후 2–5시 (가장 차분한 시간)' },
      { icon: '🎵', category: '분위기',    text: '잔잔한 재즈 음악 · 밝은 자연광' },
    ],
  },
]

export default function RecommendSection() {
  const [active, setActive] = useState(0)

  return (
    <section id="recommend" className="py-24 px-5 bg-brown-900 scroll-mt-24">
      <div className="max-w-5xl mx-auto">

        <p className="text-center text-xs tracking-[0.3em] text-brown-400 uppercase mb-3">Visit Guide</p>
        <h2 className="font-sans font-bold text-3xl md:text-4xl text-cream-50 text-center mb-3">
          이럴 때 추천해요
        </h2>
        <p className="text-center text-brown-400 text-sm mb-12 leading-relaxed">
          방문 목적을 선택하면 맞춤 가이드를 안내해 드립니다
        </p>

        {/* 목적 선택 탭 */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {PURPOSES.map((p, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                active === i
                  ? 'bg-cream-50 text-brown-900 shadow-md scale-105'
                  : 'bg-brown-800 text-brown-300 border border-brown-700 hover:border-brown-500 hover:text-brown-200'
              }`}
            >
              <span>{p.emoji}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* 선택된 카드 */}
        <div className="max-w-2xl mx-auto bg-brown-800 rounded-3xl overflow-hidden shadow-xl">

          {/* 카드 헤더 */}
          <div className="px-8 py-7 border-b border-brown-700">
            <p className="text-3xl mb-3">{PURPOSES[active].emoji}</p>
            <h3 className="text-cream-50 font-bold text-xl mb-1.5">{PURPOSES[active].title}</h3>
            <p className="text-brown-400 text-sm leading-relaxed">{PURPOSES[active].desc}</p>
          </div>

          {/* 카드 바디 */}
          <div className="px-8 py-7 grid sm:grid-cols-2 gap-6">
            {PURPOSES[active].items.map((item, j) => (
              <div key={j} className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-brown-500 text-[10px] tracking-widest uppercase mb-1">{item.category}</p>
                  <p className="text-cream-200 text-sm leading-snug">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
