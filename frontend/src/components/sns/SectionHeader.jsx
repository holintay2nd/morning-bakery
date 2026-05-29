/**
 * SNS 섹션 헤더
 * - profileUrl 있으면 뱃지를 클릭 가능한 링크로 렌더링
 * - tagline 있으면 뱃지 옆에 표시
 */
export default function SectionHeader({ config, profileUrl, tagline }) {
  const { label, color, Icon } = config

  const badge = (
    <span
      className={`inline-flex items-center gap-1.5 text-white font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${color} shadow-sm text-sm`}
    >
      <Icon />
      {label}
    </span>
  )

  return (
    <div className="flex items-center gap-4 mb-5">
      {profileUrl ? (
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-75 transition-opacity"
          aria-label={`${label} 채널로 이동`}
        >
          {badge}
        </a>
      ) : (
        badge
      )}
      {tagline && (
        <span className="text-brown-400 text-sm">{tagline}</span>
      )}
    </div>
  )
}
