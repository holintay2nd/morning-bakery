import { useState } from 'react'

const breadMenu = [
  {
    name: '크루아상',
    desc: '버터를 켜켜이 쌓아 구운 바삭한 클래식 크루아상',
    price: '3,500',
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80&auto=format&fit=crop',
    badge: 'BEST',
  },
  {
    name: '소금빵',
    desc: '겉은 바삭, 속은 촉촉한 버터 소금빵',
    price: '2,500',
    img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400&q=80&auto=format&fit=crop',
    badge: 'BEST',
  },
  {
    name: '식빵',
    desc: '매일 아침 갓 구운 부드러운 우유 식빵',
    price: '6,500',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80&auto=format&fit=crop',
    badge: null,
  },
  {
    name: '단팥빵',
    desc: '국내산 팥으로 만든 달콤한 앙금이 가득',
    price: '2,800',
    img: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&q=80&auto=format&fit=crop',
    badge: null,
  },
  {
    name: '베이글',
    desc: '뉴욕 스타일 쫄깃한 플레인 베이글',
    price: '3,000',
    img: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&q=80&auto=format&fit=crop',
    badge: 'NEW',
  },
  {
    name: '시나몬 롤',
    desc: '시나몬 설탕과 크림치즈 아이싱이 풍부한 롤빵',
    price: '4,500',
    img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80&auto=format&fit=crop',
    badge: null,
  },
]

const drinkMenu = [
  {
    name: '아메리카노',
    desc: '직접 로스팅한 원두로 내린 스트레이트 아메리카노',
    price: '4,000',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80&auto=format&fit=crop',
    badge: null,
  },
  {
    name: '카페 라떼',
    desc: '에스프레소와 신선한 우유의 부드러운 조화',
    price: '4,800',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80&auto=format&fit=crop',
    badge: 'BEST',
  },
  {
    name: '플랫화이트',
    desc: '진한 에스프레소와 마이크로폼 우유',
    price: '5,000',
    img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80&auto=format&fit=crop',
    badge: null,
  },
  {
    name: '드립 커피',
    desc: '당일 로스팅 원두를 핸드드립으로 내린 커피',
    price: '5,500',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80&auto=format&fit=crop',
    badge: 'NEW',
  },
  {
    name: '말차 라떼',
    desc: '일본산 말차 파우더를 사용한 진한 말차 라떼',
    price: '5,500',
    img: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&q=80&auto=format&fit=crop',
    badge: null,
  },
  {
    name: '얼그레이 밀크티',
    desc: '향긋한 얼그레이 티에 부드러운 우유를 더한 밀크티',
    price: '5,000',
    img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80&auto=format&fit=crop',
    badge: null,
  },
]

const badgeColor = {
  BEST: 'bg-brown-500 text-white',
  NEW: 'bg-brown-300 text-brown-900',
}

function MenuCard({ item }) {
  return (
    <div className="card group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full ${badgeColor[item.badge]}`}
          >
            {item.badge}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-lg text-brown-800">{item.name}</h3>
          <span className="text-brown-600 font-medium text-sm ml-3 shrink-0">
            ₩{item.price}
          </span>
        </div>
        <p className="text-brown-400 text-xs leading-relaxed">{item.desc}</p>
      </div>
    </div>
  )
}

export default function Menu() {
  const [activeTab, setActiveTab] = useState('bread')

  return (
    <section id="menu" className="py-24 px-5 bg-cream-100">
      <div className="max-w-6xl mx-auto">
        {/* 섹션 헤더 */}
        <p className="section-subtitle">Our Menu</p>
        <h2 className="section-title mb-3">오늘의 메뉴</h2>
        <p className="text-center text-brown-400 text-sm mb-10">
          모든 메뉴는 당일 재료로만 준비되며, 소진 시 조기 마감될 수 있습니다.
        </p>

        {/* 탭 */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('bread')}
              className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'bread'
                  ? 'bg-brown-600 text-white shadow-sm'
                  : 'text-brown-500 hover:text-brown-700'
              }`}
            >
              빵 🍞
            </button>
            <button
              onClick={() => setActiveTab('drink')}
              className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'drink'
                  ? 'bg-brown-600 text-white shadow-sm'
                  : 'text-brown-500 hover:text-brown-700'
              }`}
            >
              음료 ☕
            </button>
          </div>
        </div>

        {/* 메뉴 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'bread' ? breadMenu : drinkMenu).map((item) => (
            <MenuCard key={item.name} item={item} />
          ))}
        </div>

        {/* 안내 문구 */}
        <p className="text-center text-brown-300 text-xs mt-10">
          * 메뉴 및 가격은 시즌에 따라 변동될 수 있습니다.
        </p>
      </div>
    </section>
  )
}
