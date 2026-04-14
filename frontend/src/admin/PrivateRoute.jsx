import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../api'

export default function PrivateRoute({ children }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ok' | 'fail'

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { setStatus('fail'); return }

    api.get('/auth/me')
      .then(() => setStatus('ok'))
      .catch(() => { localStorage.removeItem('admin_token'); setStatus('fail') })
  }, [])

  if (status === 'loading') return null
  if (status === 'fail') return <Navigate to="/admin/login" replace />
  return children
}
