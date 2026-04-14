import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('admin_token', res.data.token)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || '로그인 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-sm">
        <h1 className="font-serif text-2xl text-brown-800 text-center mb-2">Morning Bakery</h1>
        <p className="text-brown-400 text-sm text-center mb-8">관리자 로그인</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-brown-600 text-sm mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-brown-200 rounded-lg px-4 py-2.5 text-sm text-brown-800 focus:outline-none focus:border-brown-400"
              placeholder="admin@morningbakery.co.kr"
            />
          </div>
          <div>
            <label className="block text-brown-600 text-sm mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-brown-200 rounded-lg px-4 py-2.5 text-sm text-brown-800 focus:outline-none focus:border-brown-400"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brown-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-brown-500 transition-colors disabled:opacity-60"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
