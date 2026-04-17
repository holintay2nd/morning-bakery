import { useEffect, useState } from 'react'
import api from '../api'

const STATUS_OPTIONS = ['대기', '확인', '완료', '취소']

const STATUS_STYLE = {
  '대기': 'bg-yellow-100 text-yellow-700',
  '확인': 'bg-blue-100 text-blue-700',
  '완료': 'bg-green-100 text-green-700',
  '취소': 'bg-gray-100 text-gray-500',
}

export default function ReservationManager() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('전체')

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations')
      setReservations(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.patch(`/reservations/${id}/status`, { status })
      setReservations((prev) => prev.map((r) => (r._id === id ? res.data : r)))
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('예약을 삭제하시겠습니까?')) return
    try {
      await api.delete(`/reservations/${id}`)
      setReservations((prev) => prev.filter((r) => r._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = filter === '전체'
    ? reservations
    : reservations.filter((r) => r.status === filter)

  if (loading) return <p className="text-center text-brown-400 py-20">불러오는 중...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-brown-800">
          예약 목록 <span className="text-brown-400 text-sm font-normal ml-1">({reservations.length}건)</span>
        </h2>
        <div className="flex gap-2">
          {['전체', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === s
                  ? 'bg-brown-600 text-white'
                  : 'bg-brown-100 text-brown-500 hover:bg-brown-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-brown-400 py-20 bg-white rounded-2xl">
          예약 내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-brown-400 text-xs">이름</span>
                    <p className="text-brown-800 font-medium">{r.name}</p>
                  </div>
                  <div>
                    <span className="text-brown-400 text-xs">연락처</span>
                    <p className="text-brown-800">{r.phone}</p>
                  </div>
                  <div>
                    <span className="text-brown-400 text-xs">수령 날짜</span>
                    <p className="text-brown-800">{r.date}{r.pickupTime && ` ${r.pickupTime}`}</p>
                  </div>
                  <div>
                    <span className="text-brown-400 text-xs">케이크 종류</span>
                    <p className="text-brown-800">{r.cakeType}</p>
                  </div>
                  <div>
                    <span className="text-brown-400 text-xs">사이즈</span>
                    <p className="text-brown-800">{r.size || '—'}</p>
                  </div>
                  <div>
                    <span className="text-brown-400 text-xs">접수일</span>
                    <p className="text-brown-800">{new Date(r.createdAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                  {r.request && (
                    <div className="sm:col-span-2 md:col-span-3">
                      <span className="text-brown-400 text-xs">요청 사항</span>
                      <p className="text-brown-700 text-sm mt-0.5 bg-cream-50 rounded-lg px-3 py-2">{r.request}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[r.status]}`}>
                    {r.status}
                  </span>
                  <select
                    value={r.status}
                    onChange={(e) => handleStatusChange(r._id, e.target.value)}
                    className="text-xs border border-brown-200 rounded-lg px-2 py-1 text-brown-600 bg-white"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
