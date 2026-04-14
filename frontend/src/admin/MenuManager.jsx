import { useState, useEffect } from 'react'
import api from '../api'

const EMPTY_FORM = { name: '', desc: '', price: '', img: '', badge: '', category: 'bread' }

export default function MenuManager() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('bread')

  const fetchItems = () => {
    api.get('/menu').then((res) => setItems(res.data))
  }

  useEffect(() => { fetchItems() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, badge: form.badge || null }
      if (editingId) {
        await api.put(`/menu/${editingId}`, payload)
      } else {
        await api.post('/menu', payload)
      }
      setForm(EMPTY_FORM)
      setEditingId(null)
      fetchItems()
    } catch (err) {
      alert(err.response?.data?.message || '저장 실패')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setForm({ name: item.name, desc: item.desc, price: item.price, img: item.img, badge: item.badge || '', category: item.category })
    setEditingId(item._id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await api.delete(`/menu/${id}`)
    fetchItems()
  }

  const filtered = items.filter((i) => i.category === activeTab)

  return (
    <div>
      {/* 메뉴 추가/수정 폼 */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="text-brown-800 font-medium mb-4">{editingId ? '메뉴 수정' : '새 메뉴 추가'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-brown-600 text-xs mb-1">메뉴 이름</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="크루아상" />
          </div>
          <div>
            <label className="block text-brown-600 text-xs mb-1">가격 (숫자만)</label>
            <input className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="3500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-brown-600 text-xs mb-1">설명</label>
            <input className="input" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} required placeholder="버터를 켜켜이 쌓아 구운 바삭한 크루아상" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-brown-600 text-xs mb-1">이미지 URL</label>
            <input className="input" value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} required placeholder="https://..." />
          </div>
          <div>
            <label className="block text-brown-600 text-xs mb-1">카테고리</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="bread">빵 (Bread)</option>
              <option value="drink">음료 (Beverage)</option>
            </select>
          </div>
          <div>
            <label className="block text-brown-600 text-xs mb-1">배지</label>
            <select className="input" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
              <option value="">없음</option>
              <option value="BEST">BEST</option>
              <option value="NEW">NEW</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={loading} className="bg-brown-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brown-500 transition-colors disabled:opacity-60">
              {loading ? '저장 중...' : editingId ? '수정 완료' : '추가하기'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setForm(EMPTY_FORM); setEditingId(null) }} className="border border-brown-200 text-brown-500 px-6 py-2.5 rounded-lg text-sm hover:bg-cream-50 transition-colors">
                취소
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 메뉴 목록 */}
      <div className="flex gap-3 mb-4">
        {['bread', 'drink'].map((cat) => (
          <button key={cat} onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === cat ? 'bg-brown-600 text-white' : 'bg-white text-brown-500 border border-brown-200'}`}>
            {cat === 'bread' ? '빵' : '음료'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-brown-400 text-sm text-center py-8">등록된 메뉴가 없습니다.</p>}
        {filtered.map((item) => (
          <div key={item._id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
            <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-medium text-brown-800 text-sm">{item.name}</span>
                {item.badge && <span className="text-xs bg-brown-100 text-brown-600 px-2 py-0.5 rounded-full">{item.badge}</span>}
              </div>
              <p className="text-brown-400 text-xs truncate">{item.desc}</p>
              <p className="text-brown-600 text-xs mt-0.5">₩{item.price}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(item)} className="text-xs text-brown-500 border border-brown-200 px-3 py-1.5 rounded-lg hover:bg-cream-50 transition-colors">수정</button>
              <button onClick={() => handleDelete(item._id)} className="text-xs text-red-400 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
