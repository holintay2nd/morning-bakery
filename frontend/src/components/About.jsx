import { useEffect, useRef, useState } from 'react'
import api from '../api'

const BADGE_STYLES = {
  SIGNATURE: 'bg-amber-400/90 text-white',
  HOT:       'bg-red-500/90 text-white',
  NEW:       'bg-emerald-500/90 text-white',
}

const defaultFeatures = [
  {
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80&auto=format&fit=crop',
    title: '버터 크루아상',
    desc: '매일 새벽 직접 구운 겹겹이 쌓인 크루아상. 고소한 버터 향과 바삭한 식감이 모닝베이커리의 대표 메뉴입니다.',
    badge: 'SIGNATURE',
  },
  {
    img: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&q=80&auto=format&fit=crop',
    title: '소금빵',
    desc: '겉은 바삭하고 속은 버터 향이 가득한 소금빵. 매일 오전 중 가장 먼저 완판되는 인기 메뉴입니다.',
    badge: 'HOT',
  },
  {
    img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80&auto=format&fit=crop',
    title: '딸기 크림 스콘',
    desc: '이번 시즌 새롭게 선보이는 딸기 크림 스콘. 달콤한 딸기잼과 클로티드 크림이 어우러진 봄의 맛입니다.',
    badge: 'NEW',
  },
]

export default function About() {
  const sectionRef = useRef(null)
  const [about, setAbout] = useState({
    title: '작지만, 진심으로',
    description: '서울 한편에 자리 잡은 작은 베이커리입니다.\n화려하진 않지만, 매일 정성껏 만드는 빵과 커피 한 잔으로\n여러분의 하루를 따뜻하게 만들고 싶습니다.',
    features: defaultFeatures,
  })

  useEffect(() => {
    api.get('/content').then((res) => {
      if (res.data.about) {
        // features는 코드에서 관리 (DB 구버전 데이터가 덮어쓰지 않도록)
        const { features: _ignored, ...rest } = res.data.about
        setAbout(prev => ({ ...prev, ...rest }))
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
              }, i * 150)
            })
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const features = (about.features?.length ? about.features : defaultFeatures).map((f, i) => ({
    badge: defaultFeatures[i % defaultFeatures.length]?.badge,
    ...f,
    img: f.img || defaultFeatures[i % defaultFeatures.length].img,
  }))

  return (
    <section id="about" ref={sectionRef} className="py-24 px-5 bg-cream-50">
      <div className="max-w-6xl mx-auto">
        {/* 상단 레이블 */}
        <div className="text-center mb-10">
          <p className="reveal text-2xl md:text-3xl tracking-[0.2em] uppercase text-brown-800 font-bold" style={{ opacity: 0, transform: 'translateY(20px)' }}>
            Menu
          </p>
        </div>

        {/* 이미지 + 텍스트 카드 */}
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="reveal relative rounded-2xl overflow-hidden h-[520px] group will-change-transform isolate" style={{ opacity: 0, transform: 'translateY(20px)' }}>
              <img
                src={f.img}
                alt={f.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* 좌상단 뱃지 */}
              {f.badge && (
                <div className="absolute top-4 left-4">
                  <span className={`backdrop-blur-sm text-[11px] font-bold tracking-[0.15em] px-3 py-1.5 rounded-full shadow-sm ${BADGE_STYLES[f.badge] ?? 'bg-white/90 text-brown-800'}`}>
                    {f.badge}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <h3 className="font-sans font-bold text-xl mb-2">{f.title}</h3>
                <p className="text-white/75 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
