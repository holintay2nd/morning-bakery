import { useEffect, useRef, useState } from 'react'
import api from '../api'

const defaultFeatures = [
  { img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80&auto=format&fit=crop', title: '매일 아침 직접 굽습니다', desc: '새벽 5시부터 오전 내내 매일 신선한 빵을 굽습니다. 전날 남은 빵은 판매하지 않습니다.', badge: 'SIGNATURE' },
  { img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80&auto=format&fit=crop', title: '좋은 재료만 씁니다', desc: '국내산 밀가루와 유기농 버터, 계절 과일을 사용해 빵 본연의 맛을 살립니다.', badge: 'HOT' },
  { img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop', title: '커피도 직접 로스팅', desc: '매주 소량씩 직접 로스팅한 원두로 드립 커피와 라떼를 내립니다.', badge: 'NEW' },
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
      if (res.data.about) setAbout(res.data.about)
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
          <p className="reveal text-sm tracking-[0.35em] uppercase text-brown-700 font-semibold" style={{ opacity: 0, transform: 'translateY(20px)' }}>
            Menu
          </p>
        </div>

        {/* 이미지 + 텍스트 카드 */}
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="reveal relative rounded-2xl overflow-hidden h-[520px] group" style={{ opacity: 0, transform: 'translateY(20px)' }}>
              <img
                src={f.img}
                alt={f.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* 좌상단 뱃지 */}
              {f.badge && (
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-brown-800 text-[11px] font-bold tracking-[0.15em] px-3 py-1.5 rounded-full shadow-sm">
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
