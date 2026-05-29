export default function SectionHeader({ config, total }) {
  const { label, color, Icon } = config
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className={`inline-flex items-center gap-1.5 text-white font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${color} shadow-sm text-sm`}>
        <Icon />
        {label}
      </span>
      {total > 0 && <span className="text-brown-300 text-xs">({total})</span>}
    </div>
  )
}
