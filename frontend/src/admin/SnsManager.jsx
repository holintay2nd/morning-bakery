import { useState, useEffect, useCallback } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2, ExternalLink, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import api from '../api'

// 수동 등록 패널 설정 (자동 연동 채널 제외)
const MANUAL_SNS_CONFIG = [
  { key: 'article', label: '기사', emoji: '📰', placeholder: 'https://news.example.com/...' },
]

// 자동 연동 상태 카드 설정
const AUTO_STATUS_CONFIG = {
  instagram: {
    emoji: '📸',
    label: '인스타그램',
    badgeClass: 'text-purple-500 bg-purple-50',
    endpoint: '/instagram/status',
    connectedText: (s) => `@${s.username} 계정 연동됨`,
    errorDefault: 'INSTAGRAM_ACCESS_TOKEN이 설정되지 않았습니다.',
    helpUrl: 'https://developers.facebook.com/docs/instagram-basic-display-api/getting-started',
    helpText: '액세스 토큰 발급 방법',
    helpClass: 'text-purple-500',
  },
  youtube: {
    emoji: '▶️',
    label: '유튜브',
    badgeClass: 'text-red-500 bg-red-50',
    endpoint: '/youtube/status',
    connectedText: (s) => `${s.channelName || s.channelId} 채널 연동됨`,
    errorDefault: 'YOUTUBE_CHANNEL_ID가 설정되지 않았습니다.',
    helpUrl: 'https://www.youtube.com/account_advanced',
    helpText: 'YouTube Studio에서 채널 ID 확인',
    helpClass: 'text-red-500',
  },
  threads: {
    emoji: '🔗',
    label: '스레드',
    badgeClass: 'text-gray-600 bg-gray-100',
    endpoint: '/threads/status',
    connectedText: (s) => `@${s.username} 계정 연동됨`,
    errorDefault: 'THREADS_ACCESS_TOKEN이 설정되지 않았습니다.',
    helpUrl: 'https://developers.facebook.com/docs/threads',
    helpText: '액세스 토큰 발급 방법',
    helpClass: 'text-gray-600',
  },
  naverBlog: {
    emoji: '📝',
    label: '네이버 블로그',
    badgeClass: 'text-green-700 bg-green-50',
    endpoint: '/naverblog/status',
    connectedText: (s) => `${s.blogTitle} 연동됨`,
    errorDefault: 'NAVER_BLOG_ID가 설정되지 않았습니다.',
    helpUrl: null,
    helpText: null,
    helpClass: null,
    extraHelp: '블로그 URL의 아이디를 Heroku에 설정하세요.\n예) blog.naver.com/morningbakery → NAVER_BLOG_ID=morningbakery',
  },
}

const EMPTY_FORM = { url: '', thumbnail: '', title: '' }

// 자동 연동 상태 카드 (공통 컴포넌트)
function SnsStatusCard({ type }) {
  const config = AUTO_STATUS_CONFIG[type]
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = useCallback(() => {
    setLoading(true)
    api.get(config.endpoint)
      .then((res) => setStatus(res.data))
      .catch(() => setStatus({ connected: false }))
      .finally(() => setLoading(false))
  }, [config.endpoint])

  useEffect(() => { fetchStatus() }, [fetchStatus])

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">{config.emoji}</span>
          <span className="font-medium text-brown-800 text-sm">{config.label}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badgeClass}`}>
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
              <p className="text-green-700 text-xs font-medium">{config.connectedText(status)}</p>
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
                {status?.error || config.errorDefault}
              </p>
              {config.helpUrl && (
                <a
                  href={config.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 ${config.helpClass} text-[11px] mt-1.5 hover:underline`}
                >
                  {config.helpText} <ExternalLink size={10} />
                </a>
              )}
              {config.extraHelp && (
                <p className="text-brown-400 text-[11px] mt-1 whitespace-pre-line">
                  {config.extraHelp}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 수동 SNS 항목 패널
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
                <div key={item._id} className="flex items-center gap-3 bg-cream-50 rounded-xl p-3">
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

export default function SnsManager() {
  const [snsData, setSnsData] = useState({})

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
          인스타그램·유튜브·스레드·네이버 블로그는 API로 자동 연동됩니다.
          기사 등 추가 콘텐츠는 아래에서 직접 등록하세요.
        </p>
      </div>

      {/* 자동 연동 상태 카드 */}
      <SnsStatusCard type="instagram" />
      <SnsStatusCard type="youtube" />
      <SnsStatusCard type="threads" />
      <SnsStatusCard type="naverBlog" />

      {/* 수동 등록 패널 구분선 */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-brown-100" />
        <span className="text-brown-300 text-xs font-medium">수동 등록</span>
        <div className="flex-1 h-px bg-brown-100" />
      </div>

      {/* 수동 SNS 패널 (기사만) */}
      {MANUAL_SNS_CONFIG.map((config) => (
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
