// Repeating diagonal text over its children, so screenshots carry the owner's name.
// The pattern is an SVG used as a CSS mask over a block of the ink colour,
// so it follows the light/dark theme automatically.

const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]))

function pattern(lines) {
  const w = 360
  const h = 170
  const text = lines.map((l, i) => `<text x="0" y="${i * 22}" font-family="Arial, sans-serif" font-size="${i === 0 ? 18 : 12}" font-weight="${i === 0 ? 700 : 400}">${esc(l)}</text>`).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g transform="translate(24 ${h - 40}) rotate(-24)">${text}</g></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export default function Watermark({ lines, children, className = '' }) {
  const mask = pattern(lines)
  return (
    <div className={`relative ${className}`}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute inset-0 z-10 rounded-[inherit] opacity-[0.13]"
        style={{
          background: 'var(--ink)',
          WebkitMaskImage: mask, maskImage: mask,
          WebkitMaskRepeat: 'repeat', maskRepeat: 'repeat',
        }}
      />
    </div>
  )
}
