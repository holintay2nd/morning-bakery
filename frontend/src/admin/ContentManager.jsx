import { useState, useEffect } from 'react'
import api from '../api'

export default function ContentManager() {
  const [hero, setHero] = useState({ title: '', subtitle: '', description: '', backgroundImage: '' })
  const [about, setAbout] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/content').then((res) => {
      setHero(res.data.hero || {})
      setAbout(res.data.about || {})
    })
  }, [])

  const saveHero = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.patch('/content/hero', hero)
      alert('Hero 섹션이 저장되었습니다.')
    } catch {
      alert('저장 실패')
    } finally {
      setLoading(false)
    }
  }

  const saveAbout = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.patch('/content/about', about)
      alert('About 섹션이 저장되었습니다.')
    } catch {
      alert('저장 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero 섹션 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-brown-800 font-medium mb-4">Hero 섹션 (메인 배너)</h2>
        <form onSubmit={saveHero} className="space-y-4">
          <div>
            <label className="block text-brown-600 text-xs mb-1">제목</label>
            <input className="input" value={hero.title || ''} onChange={(e) => setHero({ ...hero, title: e.target.value })} placeholder="Morning Bakery" />
          </div>
          <div>
            <label className="block text-brown-600 text-xs mb-1">부제목 (태그라인)</label>
            <input className="input" value={hero.subtitle || ''} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} placeholder="당일 생산 · 당일 판매" />
          </div>
          <div>
            <label className="block text-brown-600 text-xs mb-1">설명 문구</label>
            <textarea className="input resize-none" rows={3} value={hero.description || ''} onChange={(e) => setHero({ ...hero, description: e.target.value })} placeholder="매일 새벽 5시, 오늘의 빵을 굽기 시작합니다." />
          </div>
          <div>
            <label className="block text-brown-600 text-xs mb-1">배경 이미지 URL</label>
            <input className="input" value={hero.backgroundImage || ''} onChange={(e) => setHero({ ...hero, backgroundImage: e.target.value })} placeholder="https://..." />
            {hero.backgroundImage && (
              <img src={hero.backgroundImage} alt="미리보기" className="mt-2 h-24 w-full object-cover rounded-lg" />
            )}
          </div>
          <button type="submit" disabled={loading} className="bg-brown-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brown-500 transition-colors disabled:opacity-60">
            저장
          </button>
        </form>
      </div>

      {/* About 섹션 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-brown-800 font-medium mb-4">About 섹션 (우리 이야기)</h2>
        <form onSubmit={saveAbout} className="space-y-4">
          <div>
            <label className="block text-brown-600 text-xs mb-1">제목</label>
            <input className="input" value={about.title || ''} onChange={(e) => setAbout({ ...about, title: e.target.value })} placeholder="작지만, 진심으로" />
          </div>
          <div>
            <label className="block text-brown-600 text-xs mb-1">설명 문구</label>
            <textarea className="input resize-none" rows={4} value={about.description || ''} onChange={(e) => setAbout({ ...about, description: e.target.value })} placeholder="서울 한편에 자리 잡은 작은 베이커리입니다." />
          </div>
          <button type="submit" disabled={loading} className="bg-brown-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brown-500 transition-colors disabled:opacity-60">
            저장
          </button>
        </form>
      </div>
    </div>
  )
}
