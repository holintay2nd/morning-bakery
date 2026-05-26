import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2, ExternalLink, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import api from '../api'

const SNS_CONFIG = [
  { key: 'youtube', label: '유튜브', emoji: '▶️', placeholder: 'https://www.youtube.com/watch?v=...' },
  { key: 'naverBlog', label: '네이버 블로그', emoji: '📝', placeholder: 'https://blog.naver.com/...' },
  { key: 'threads', label: '스레드', emoji: '🔗', placeholder: 'https://www.threads.net/...' },
  { key: 'article', label: '기사', emoji: '📰', placeholder: 'https://news.example.com/...' },
]

const EMPTY_FORM = { url: '', thumbnail: '', title: '' }

function SnsTypePanel({ config, items, onAdd, onDelete }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onAdd(config.key, form)
      setForm(EMPTY_FORM)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
      {/* 패널 헤더 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-cream-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{config.emoji}</span>
          <span className="font-medium text-brown-800 text-sm">{config.label}</span>
          <span className="text-xs text-brown-400 bg-cream-100 px-2 py-0.5 rounded-full">
            {items.length}개
          </span>
        </div>
        {open ? <ChevronUp size={16} className="text-brown-400" /> : <ChevronDown size={16} className="text-brown-400" />}
      </button>

      {open && (
        <div className="border-t border-brown-50 px-6 pb-6">
          {/* 추가 폼 */}
          <div className="pt-5 mb-6">
            <h4 className="text-brown-600 text-xs font-medium mb-3">새 항목 추가</h4>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-brown-500 text-xs mb-1">제목 / 캡션</label>
                <input
                  className="input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="게시물 제목을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-brown-500 text-xs mb-1">썸네일 이미지 URL</label>
                <input
                  className="input"
                  value={form.thumbnail}
                  onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  required
                  placeholder="https://..."
                />
                {form.thumbnail && (
                  <img
                    src={form.thumbnail}
                    alt="미리보기"
                    className="mt-2 h-20 w-full object-cover rounded-lg border border-brown-100"
                  />
                )}
              </div>
              <div>
                <label className="block text-brown-500 text-xs mb-1">링크 URL</label>
                <input
                  className="input"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  required
                  placeholder={config.placeholder}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-brown-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brown-500 transition-colors disabled:opacity-60"
              >
                <Plus size={14} />
                {loading ? '추가 중...' : '추가하기'}
              </button>
            </form>
          </div>

          {/* 등록된 항목 목록 */}
          {items.length === 0 ? (
            <p className="text-brown-300 text-xs text-center py-4 bg-cream-50 rounded-lg">
              등록된 항목이 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              <h4 className="text-brown-600 text-xs font-medium mb-2">등록된 항목 ({items.length})</h4>
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 bg-cream-50 rounded-xl p-3"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-lg shrink-0 border border-brown-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-brown-800 text-xs font-medium truncate">{item.title}</p>
                    <p className="text-brown-400 text-[11px] truncate mt-0.5">{item.url}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-brown-400 hover:text-brown-600 transition-colors"
                      title="링크 열기"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={() => onDelete(config.key, item._id)}
                      className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                      title="삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// 인스타그램 연동 상태 카드
function InstagramStatusCard() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = () => {
    setLoading(true)
    api.get('/instagram/status')
      .then((res) => setStatus(res.data))
      .catch(() => setStatus({ connected: false }))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchStatus() }, [])

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">📸</span>
          <span className="font-medium text-brown-800 text-sm">인스타그램</span>
          <span className="text-xs text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full font-medium">
            자동 연동
          </span>
        </div>
        <button
          onClick={fetchStatus}
          className="p-1.5 text-brown-400 hover:text-brown-600 transition-colors"
          title="상태 새로고침"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="border-t border-brown-50 px-6 py-4">
        {loading ? (
          <p className="text-brown-400 text-xs">확인 중...</p>
        ) : status?.connected ? (
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-green-500 shrink-0" />
            <div>
              <p className="text-green-700 text-xs font-medium">
                @{status.username} 계정 연동됨
              </p>
              <p className="text-brown-400 text-[11px] mt-0.5">
                최근 게시물이 메인 페이지에 자동으로 표시됩니다. (15분 캐시)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-600 text-xs font-medium">연동 안 됨</p>
              <p className="text-brown-400 text-[11px] mt-0.5">
                {status?.error || 'INSTAGRAM_ACCESS_TOKEN이 설정되지 않았습니다.'}
              </p>
              <a
                href="https://developers.facebook.com/docs/instagram-basic-display-api/getting-started"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-purple-500 text-[11px] mt-1.5 hover:underline"
              >
                액세스 토큰 발급 방법 <ExternalLink size={10} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SnsManager() {
  const [snsData, setSnsData] = useState({
    youtube: [],
    naverBlog: [],
    threads: [],
    article: [],
  })

  const fetchSns = () => {
    api.get('/content/sns').then((res) => setSnsData(res.data || {}))
  }

  useEffect(() => { fetchSns() }, [])

  const handleAdd = async (type, form) => {
    try {
      await api.post(`/content/sns/${type}`, form)
      fetchSns()
    } catch (err) {
      alert(err.response?.data?.message || '추가에 실패했습니다.')
      throw err
    }
  }

  const handleDelete = async (type, id) => {
    if (!confirm('이 항목을 삭제하시겠습니까?')) return
    try {
      await api.delete(`/content/sns/${type}/${id}`)
      fetchSns()
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-brown-800 font-medium mb-1">SNS 관리</h2>
        <p className="text-brown-400 text-xs">
          인스타그램은 Graph API로 자동 연동됩니다. 나머지 채널은 직접 등록하세요.
        </p>
      </div>

      {/* 인스타그램 자동 연동 카드 */}
      <InstagramStatusCard />

      {/* 나머지 SNS 수동 관리 */}
      {SNS_CONFIG.map((config) => (
        <SnsTypePanel
          key={config.key}
          config={config}
          items={snsData[config.key] || []}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
