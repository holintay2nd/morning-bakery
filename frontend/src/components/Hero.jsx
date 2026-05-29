import { useEffect, useRef, useState } from 'react'
import api from '../api'

// SNS 아이콘 정의 (Simple Icons 공식 SVG)
const SNS_ICONS = [
  {
    key: 'instagram',
    label: 'Instagram',
    viewBox: '0 0 24 24',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    viewBox: '0 0 24 24',
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    key: 'naverBlog',
    label: '네이버 블로그',
    viewBox: '0 0 24 24',
    path: 'M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z',
  },
  {
    key: 'threads',
    label: 'Threads',
    viewBox: '0 0 24 24',
    path: 'M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z',
  },
]

export default function Hero() {
  const textRef = useRef(null)
  const [hero, setHero] = useState({
    title: 'Morning\nBakery',
    subtitle: '당일 생산 · 당일 판매',
    description: '매일 새벽 5시, 오늘의 빵을 굽기 시작합니다.\n신선함을 가장 중요하게 생각하는 작은 베이커리입니다.',
    backgroundImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80&auto=format&fit=crop',
  })
  const [snsLinks, setSnsLinks] = useState({
    instagram: '',
    youtube:   '',
    naverBlog: '',
    threads:   '',
  })

  useEffect(() => {
    api.get('/content').then((res) => {
      if (res.data.hero) setHero(res.data.hero)
    }).catch(() => {})
  }, [])

  // SNS 연결 URL 로드 (캐시된 데이터라 빠름)
  useEffect(() => {
    Promise.allSettled([
      api.get('/instagram/feed'),
      api.get('/youtube/feed'),
      api.get('/naverblog/feed'),
      api.get('/threads/feed'),
    ]).then(([ig, yt, nb, th]) => {
      setSnsLinks({
        instagram: ig.status === 'fulfilled' && ig.value.data?.username
          ? `https://www.instagram.com/${ig.value.data.username}` : '',
        youtube:   yt.status === 'fulfilled' ? (yt.value.data?.channelUrl || '') : '',
        naverBlog: nb.status === 'fulfilled' ? (nb.value.data?.blogUrl   || '') : '',
        threads:   th.status === 'fulfilled' && th.value.data?.username
          ? `https://www.threads.net/@${th.value.data.username}` : '',
      })
    })
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

        {/* SNS 아이콘 뱃지 */}
        <div className="flex items-center justify-center gap-3">
          {SNS_ICONS.map(({ key, label, viewBox, path }) => {
            const href = snsLinks[key]
            return href ? (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              >
                <svg viewBox={viewBox} className="w-5 h-5 fill-white" aria-hidden="true">
                  <path d={path} />
                </svg>
              </a>
            ) : (
              <span
                key={key}
                aria-label={label}
                className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center opacity-40"
              >
                <svg viewBox={viewBox} className="w-5 h-5 fill-white" aria-hidden="true">
                  <path d={path} />
                </svg>
              </span>
            )
          })}
        </div>
      </div>

      {/* 스크롤 유도 */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 inset-x-0 flex justify-center text-white/60 hover:text-white transition-colors animate-bounce"
        aria-label="아래로 스크롤"
      >
        <svg width="48" height="24" viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2,4 24,20 46,4" />
        </svg>
      </button>
    </section>
  )
}
