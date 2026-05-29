export function formatRelativeDate(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const h  = Math.floor(diff / 3_600_000)
  const d  = Math.floor(diff / 86_400_000)
  const mo = Math.floor(d / 30)
  const y  = Math.floor(d / 365)
  if (y  >= 1) return `${y}년 전`
  if (mo >= 1) return `${mo}개월 전`
  if (d  >= 1) return `${d}일 전`
  if (h  >= 1) return `${h}시간 전`
  return '방금 전'
}

export function formatViewCount(count) {
  if (!count) return ''
  const n = parseInt(count, 10)
  if (Number.isNaN(n)) return ''
  if (n >= 100_000_000) return `조회수 ${(n / 100_000_000).toFixed(1)}억회`
  if (n >= 10_000)      return `조회수 ${(n / 10_000).toFixed(1)}만회`
  if (n >= 1_000)       return `조회수 ${(n / 1_000).toFixed(1)}천회`
  return `조회수 ${n}회`
}

// 캡션 첫 줄 → 제목, 나머지 → 본문 (구분자 줄 제외)
export function parseCaption(caption = '') {
  const lines = caption.split('\n').map(l => l.trim()).filter(Boolean)
  const title = lines[0] || ''
  const body  = lines.slice(1).filter(l => !/^[.·•\-=_~]+$/.test(l)).join(' ').trim()
  return { title, body }
}

export function formatBlogDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return ''
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`
}
