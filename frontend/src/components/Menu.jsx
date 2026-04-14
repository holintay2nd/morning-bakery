import { useState, useEffect } from 'react'
import api from '../api'

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
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/menu')
      .then((res) => setMenuItems(res.data))
      .catch(() => setMenuItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = menuItems.filter((item) => item.category === activeTab)

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
              Bread
            </button>
            <button
              onClick={() => setActiveTab('drink')}
              className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'drink'
                  ? 'bg-brown-600 text-white shadow-sm'
                  : 'text-brown-500 hover:text-brown-700'
              }`}
            >
              Beverage
            </button>
          </div>
        </div>

        {/* 메뉴 그리드 */}
        {loading ? (
          <p className="text-center text-brown-400 text-sm py-16">메뉴를 불러오는 중...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-brown-400 text-sm py-16">등록된 메뉴가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* 안내 문구 */}
        <p className="text-center text-brown-300 text-xs mt-10">
          * 메뉴 및 가격은 시즌에 따라 변동될 수 있습니다.
        </p>
      </div>
    </section>
  )
}
