import { useState, useEffect, useCallback } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2, ExternalLink, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import api from '../api'

// 수동 등록 패널 설정 (자동 연동 채널 제외)
const MANUAL_SNS_CONFIG = [
  { key: 'article', label: '기사', emoji: '📰', placeholder: 'https://news.example.com/...' },
]

// 유튜브 전용 카드 (채널 ID + API 키 직접 입력)
function YoutubeSettingsCard() {
  const [saved, setSaved] = useState({ channelId: '', hasApiKey: false })
  const [channelId, setChannelId] = useState('')
  const [apiKey, setApiKey] = useState('')           // 항상 빈 값으로 시작 (보안)
  const [showApiKey, setShowApiKey] = useState(false)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [settingsRes, statusRes] = await Promise.allSettled([
        api.get('/content/settings'),
        api.get('/youtube/status'),
      ])
      if (settingsRes.status === 'fulfilled') {
        const { youtubeChannelId, hasYoutubeApiKey } = settingsRes.value.data
        setSaved({ channelId: youtubeChannelId || '', hasApiKey: !!hasYoutubeApiKey })
        setChannelId(youtubeChannelId || '')
      }
      setStatus(statusRes.status === 'fulfilled' ? statusRes.value.data : { connected: false })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleSave = async () => {
    setSaving(true)
    try {
      const patch = { youtubeChannelId: channelId.trim() }
      if (apiKey.trim()) patch.youtubeApiKey = apiKey.trim()
      await api.patch('/content/settings', patch)
      setApiKey('')         // 저장 후 입력창 초기화
      const res = await api.get('/youtube/status')
      setStatus(res.data)
      setSaved({ channelId: channelId.trim(), hasApiKey: !!(apiKey.trim() || saved.hasApiKey) })
    } catch {
      alert('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const changed = channelId.trim() !== saved.channelId || apiKey.trim() !== ''

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
      {/* 헤더 */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">▶️</span>
          <span className="font-medium text-brown-800 text-sm">유튜브</span>
          <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full font-medium">
            자동 연동
          </span>
        </div>
        <button
          onClick={fetchAll}
          className="p-1.5 text-brown-400 hover:text-brown-600 transition-colors"
          title="상태 새로고침"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="border-t border-brown-50 px-6 py-4 space-y-4">
        {/* 채널 ID 입력 */}
        <div>
          <label className="block text-brown-500 text-xs font-medium mb-1.5">채널 ID</label>
          <input
            className="input w-full font-mono text-xs"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="UCxxxxxxxxxxxxxxxxxxxxxxxxx"
            spellCheck={false}
          />
          <p className="text-brown-300 text-[11px] mt-1">
            YouTube Studio → 설정 → 채널 → 고급 설정에서 확인
          </p>
        </div>

        {/* API 키 입력 */}
        <div>
          <label className="block text-brown-500 text-xs font-medium mb-1.5">
            API 키
            <span className="ml-1.5 text-brown-300 font-normal">
              {saved.hasApiKey ? '(설정됨 — 변경하려면 새 키 입력)' : '(선택 — 없으면 RSS 방식 사용)'}
            </span>
          </label>
          <div className="flex gap-2">
            <input
              className="input flex-1 font-mono text-xs"
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={saved.hasApiKey ? '••••••••••••••••••••••••••••••••••••••••' : 'AIzaSy...'}
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setShowApiKey((v) => !v)}
              className="px-3 py-2 text-brown-400 hover:text-brown-600 text-xs border border-brown-100 rounded-lg transition-colors"
            >
              {showApiKey ? '숨김' : '표시'}
            </button>
          </div>
          <p className="text-brown-300 text-[11px] mt-1">
            <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer"
              className="underline hover:text-brown-500">Google Cloud Console</a>
            {' '}→ YouTube Data API v3 → 사용자 인증 정보 → API 키
          </p>
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          disabled={saving || !changed}
          className="w-full py-2 bg-brown-600 text-white text-xs font-medium rounded-lg hover:bg-brown-500 disabled:opacity-40 transition-colors"
        >
          {saving ? '저장 중...' : '저장하고 연결 확인'}
        </button>

        {/* 연결 상태 */}
        {loading ? (
          <p className="text-brown-400 text-xs">확인 중...</p>
        ) : status?.connected ? (
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-green-500 shrink-0" />
            <div>
              <p className="text-green-700 text-xs font-medium">
                {status.channelName || saved.channelId} 연동됨
                <span className="ml-1.5 text-green-500 text-[10px]">
                  ({status.method === 'api' ? 'Data API' : 'RSS'})
                </span>
              </p>
              <p className="text-brown-400 text-[11px] mt-0.5">
                최근 영상이 메인 페이지에 자동으로 표시됩니다. (15분 캐시)
              </p>
            </div>
          </div>
        ) : saved.channelId ? (
          <div className="flex items-start gap-2">
            <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-600 text-xs font-medium">연동 실패</p>
              <p className="text-brown-400 text-[11px] mt-0.5">
                {status?.error || '채널 ID를 다시 확인해 주세요.'}
              </p>
              {!saved.hasApiKey && (
                <p className="text-amber-600 text-[11px] mt-1">
                  💡 RSS 방식이 실패했습니다. API 키를 입력하면 더 안정적으로 연동됩니다.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-brown-400 text-xs">채널 ID를 입력하고 저장하세요.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// 자동 연동 상태 카드 설정 (YouTube 제외)
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

const TAGLINE_CONFIG = [
  { key: 'instagram', label: '인스타그램', placeholder: '일상의 순간들을 공유합니다' },
  { key: 'youtube',   label: '유튜브',     placeholder: '베이킹 영상을 업로드합니다' },
  { key: 'naverBlog', label: '네이버 블로그', placeholder: '레시피와 이야기를 나눕니다' },
  { key: 'threads',   label: '스레드',     placeholder: '오늘의 소식을 전합니다' },
]

const EMPTY_TAGLINES = { instagram: '', youtube: '', naverBlog: '', threads: '' }

// SNS 뱃지 옆 태그라인 설정 패널
function TaglinesPanel() {
  const [taglines, setTaglines] = useState(EMPTY_TAGLINES)
  const [saved,    setSaved]    = useState(EMPTY_TAGLINES)
  const [saving,   setSaving]   = useState(false)
  const [loaded,   setLoaded]   = useState(false)

  useEffect(() => {
    api.get('/content/sns-taglines')
      .then((res) => {
        const data = res.data || {}
        setTaglines({ ...EMPTY_TAGLINES, ...data })
        setSaved({ ...EMPTY_TAGLINES, ...data })
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.patch('/content/sns-taglines', taglines)
      setSaved({ ...taglines })
    } catch {
      alert('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const changed = JSON.stringify(taglines) !== JSON.stringify(saved)

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-brown-50">
        <h3 className="font-medium text-brown-800 text-sm">뱃지 태그라인</h3>
        <p className="text-brown-400 text-xs mt-0.5">각 SNS 뱃지 옆에 표시할 문구를 입력하세요 (비워두면 표시 안 됨)</p>
      </div>
      <div className="px-6 py-4 space-y-3">
        {!loaded ? (
          <p className="text-brown-400 text-xs">불러오는 중...</p>
        ) : (
          <>
            {TAGLINE_CONFIG.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-brown-500 text-xs font-medium mb-1">{label}</label>
                <input
                  className="input"
                  value={taglines[key] || ''}
                  onChange={(e) => setTaglines((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  maxLength={60}
                />
              </div>
            ))}
            <button
              onClick={handleSave}
              disabled={saving || !changed}
              className="w-full py-2 bg-brown-600 text-white text-xs font-medium rounded-lg hover:bg-brown-500 disabled:opacity-40 transition-colors"
            >
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </>
        )}
      </div>
    </div>
  )
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

      {/* 태그라인 설정 */}
      <TaglinesPanel />

      {/* 자동 연동 상태 카드 */}
      <SnsStatusCard type="instagram" />
      <YoutubeSettingsCard />
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
