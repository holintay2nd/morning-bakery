/**
 * SNS 섹션 스켈레톤 UI
 * – 실제 카드 레이아웃과 크기를 최대한 유사하게 맞춤
 * – Tailwind animate-pulse로 shimmer 효과
 */

const CARD_GAP = 16
const CARD_W   = { ig: 360, yt: 568, nb: (1152 - 2 * CARD_GAP) / 3, th: (1152 - 2 * CARD_GAP) / 3 }

// 회색 placeholder 블록
function Bone({ className = '' }) {
  return <div className={`bg-gray-200 rounded-xl ${className}`} />
}

// 섹션 헤더 뱃지 스켈레톤
function HeaderBone() {
  return (
    <div className="flex items-center gap-2 mb-5">
      <Bone className="h-7 w-36 rounded-full" />
      <Bone className="h-4 w-10 rounded-full" />
    </div>
  )
}

// ── Instagram: 3장, aspect-[3/4] ─────────────────────────────────────────
function InstagramSkeleton() {
  return (
    <div className="mb-14">
      <HeaderBone />
      <div className="flex overflow-hidden py-4" style={{ gap: CARD_GAP }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="flex-shrink-0 rounded-2xl overflow-hidden"
            style={{ width: CARD_W.ig }}
          >
            <Bone className="aspect-[3/4] rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── YouTube: 2장, 16:9 비슷한 비율 ──────────────────────────────────────
function YoutubeSkeleton() {
  return (
    <div className="mb-14">
      <HeaderBone />
      <div className="flex overflow-hidden py-4" style={{ gap: CARD_GAP }}>
        {[0, 1].map(i => (
          <div
            key={i}
            className="flex-shrink-0 rounded-2xl overflow-hidden"
            style={{ width: CARD_W.yt }}
          >
            {/* 썸네일 */}
            <Bone className="aspect-video rounded-t-2xl rounded-b-none" />
            {/* 텍스트 영역 */}
            <div className="bg-gray-100 rounded-b-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Bone className="w-8 h-8 rounded-full flex-shrink-0" />
                <Bone className="h-3 w-28 rounded-full" />
              </div>
              <Bone className="h-4 w-full rounded-full" />
              <Bone className="h-4 w-3/4 rounded-full" />
              <Bone className="h-3 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── NaverBlog: 3장, 텍스트 위 + 정방형 썸네일 아래 ─────────────────────
function NaverBlogSkeleton() {
  return (
    <div className="mb-14">
      <HeaderBone />
      <div className="flex overflow-hidden py-4" style={{ gap: CARD_GAP }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="flex-shrink-0 rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm"
            style={{ width: CARD_W.nb }}
          >
            {/* 텍스트 영역 */}
            <div className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <Bone className="h-3 w-24 rounded-full" />
                <Bone className="h-3 w-16 rounded-full" />
              </div>
              <Bone className="h-4 w-full rounded-full" />
              <Bone className="h-3 w-full rounded-full" />
              <Bone className="h-3 w-2/3 rounded-full" />
            </div>
            {/* 정방형 썸네일 */}
            <div className="px-3.5 pb-3.5">
              <Bone className="aspect-square rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Threads: 3장, 프로필 + 텍스트 줄 + 이미지 영역 ──────────────────────
function ThreadsSkeleton() {
  return (
    <div className="mb-14">
      <HeaderBone />
      <div className="flex overflow-hidden py-4" style={{ gap: CARD_GAP }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="flex-shrink-0 rounded-2xl bg-white border border-gray-100 shadow-sm p-4 space-y-3"
            style={{ width: CARD_W.th }}
          >
            {/* 프로필 */}
            <div className="flex items-center gap-2">
              <Bone className="w-9 h-9 rounded-full flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Bone className="h-3 w-24 rounded-full" />
                <Bone className="h-3 w-16 rounded-full" />
              </div>
            </div>
            {/* 텍스트 줄 */}
            <div className="space-y-2">
              <Bone className="h-3.5 w-full rounded-full" />
              <Bone className="h-3.5 w-full rounded-full" />
              <Bone className="h-3.5 w-3/4 rounded-full" />
            </div>
            {/* 이미지 자리 (카드 1/3에만 표시) */}
            {i === 1 && <Bone className="aspect-square rounded-xl" />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 전체 스켈레톤 ────────────────────────────────────────────────────────
export default function SnsSkeleton() {
  return (
    <div className="animate-pulse">
      <InstagramSkeleton />
      <YoutubeSkeleton />
      <NaverBlogSkeleton />
      <ThreadsSkeleton />
    </div>
  )
}
