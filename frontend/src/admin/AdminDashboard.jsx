import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuManager from './MenuManager'
import ContentManager from './ContentManager'
import ReservationManager from './ReservationManager'

const tabs = [
  { id: 'menu', label: '메뉴 관리' },
  { id: 'content', label: '콘텐츠 수정' },
  { id: 'reservation', label: '예약 관리' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('menu')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-brown-100 px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-xl text-brown-800">Morning Bakery 관리자</h1>
        <button
          onClick={handleLogout}
          className="text-brown-400 hover:text-brown-600 text-sm transition-colors"
        >
          로그아웃
        </button>
      </header>

      {/* 탭 */}
      <div className="bg-white border-b border-brown-100 px-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brown-600 text-brown-800'
                  : 'border-transparent text-brown-400 hover:text-brown-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 콘텐츠 */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === 'menu' && <MenuManager />}
        {activeTab === 'content' && <ContentManager />}
        {activeTab === 'reservation' && <ReservationManager />}
      </main>
    </div>
  )
}
