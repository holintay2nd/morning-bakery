import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import api from '../api'

export default function Hero() {
  const textRef = useRef(null)
  const [hero, setHero] = useState({
    title: 'Morning\nBakery',
    subtitle: '당일 생산 · 당일 판매',
    description: '매일 새벽 5시, 오늘의 빵을 굽기 시작합니다.\n신선함을 가장 중요하게 생각하는 작은 베이커리입니다.',
    backgroundImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80&auto=format&fit=crop',
  })

  useEffect(() => {
    api.get('/content').then((res) => {
      if (res.data.hero) setHero(res.data.hero)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const el = textRef.current
    if (el) {
      el.style.opacity = '0'
      el.style.transform = 'translateY(30px)'
      setTimeout(() => {
        el.style.transition = 'opacity 1s ease, transform 1s ease'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 200)
    }
  }, [])

  const scrollToMenu = () => {
    document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollDown = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={hero.backgroundImage}
          alt="모닝베이커리 매장 분위기"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brown-900/60 via-brown-900/40 to-brown-900/70" />
      </div>

      {/* 콘텐츠 */}
      <div ref={textRef} className="relative z-10 text-center text-white px-5 max-w-3xl">
        <p className="text-xs md:text-sm tracking-[0.3em] text-cream-200 mb-4 uppercase">
          Seoul · Bakery Café
        </p>

        <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-6">
          {hero.title.split('\n').map((line, i) => (
            <span key={i}>
              {i === 1 ? <span className="italic text-brown-300">{line}</span> : line}
              {i === 0 && <br />}
            </span>
          ))}
        </h1>

        <div className="inline-block border border-cream-200/60 rounded-full px-6 py-2 mb-6">
          <p className="text-sm md:text-base tracking-widest text-cream-100 font-light">
            {hero.subtitle}
          </p>
        </div>

        <p className="text-cream-200 text-sm md:text-base leading-relaxed mb-10 font-light">
          {hero.description.split('\n').map((line, i) => (
            <span key={i}>{line}{i < hero.description.split('\n').length - 1 && <br className="hidden md:block" />}</span>
          ))}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToMenu}
            className="bg-brown-500 text-white px-8 py-3 rounded-full text-sm tracking-wide hover:bg-brown-400 transition-colors duration-300 w-full sm:w-auto"
          >
            메뉴 보기
          </button>
          <button
            onClick={() => document.querySelector('#reservation')?.scrollIntoView({ behavior: 'smooth' })}
            className="border border-white text-white px-8 py-3 rounded-full text-sm tracking-wide hover:bg-white hover:text-brown-700 transition-all duration-300 w-full sm:w-auto"
          >
            케이크 예약
          </button>
        </div>
      </div>

      {/* 스크롤 유도 */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce"
        aria-label="아래로 스크롤"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  )
}
