import { useEffect, useRef, useState } from 'react'
import api from '../api'

const defaultFeatures = [
  { icon: '🌅', title: '매일 아침 직접 굽습니다', desc: '새벽 5시부터 오전 내내 매일 신선한 빵을 굽습니다. 전날 남은 빵은 판매하지 않습니다.' },
  { icon: '🌾', title: '좋은 재료만 씁니다', desc: '국내산 밀가루와 유기농 버터, 계절 과일을 사용해 빵 본연의 맛을 살립니다.' },
  { icon: '☕', title: '커피도 직접 로스팅', desc: '매주 소량씩 직접 로스팅한 원두로 드립 커피와 라떼를 내립니다.' },
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

  const features = about.features?.length ? about.features : defaultFeatures

  return (
    <section id="about" ref={sectionRef} className="py-24 px-5 bg-cream-50">
      <div className="max-w-6xl mx-auto">
        {/* 상단 텍스트 */}
        <div className="text-center mb-20">
          <p className="reveal section-subtitle" style={{ opacity: 0, transform: 'translateY(20px)' }}>
            Our Story
          </p>
          <h2 className="reveal section-title" style={{ opacity: 0, transform: 'translateY(20px)' }}>
            {about.title}
          </h2>
          <p className="reveal text-brown-500 max-w-lg mx-auto leading-relaxed text-sm md:text-base" style={{ opacity: 0, transform: 'translateY(20px)' }}>
            {about.description.split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </p>
        </div>

        {/* 분위기 이미지 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-20">
          <div className="reveal col-span-2 md:col-span-1 row-span-2 rounded-2xl overflow-hidden h-64 md:h-auto" style={{ opacity: 0, transform: 'translateY(20px)' }}>
            <img
              src={about.images?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80&auto=format&fit=crop'}
              alt="매장 내부"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="reveal rounded-2xl overflow-hidden h-40" style={{ opacity: 0, transform: 'translateY(20px)' }}>
            <img
              src={about.images?.[1] || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80&auto=format&fit=crop'}
              alt="갓 구운 빵"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="reveal rounded-2xl overflow-hidden h-40" style={{ opacity: 0, transform: 'translateY(20px)' }}>
            <img
              src={about.images?.[2] || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&auto=format&fit=crop'}
              alt="라떼 아트"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* 특징 카드 */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="reveal bg-white rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow duration-300" style={{ opacity: 0, transform: 'translateY(20px)' }}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-serif text-lg text-brown-700 mb-3">{f.title}</h3>
              <p className="text-brown-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
