// App mark: “HS · NPCC” over “LMSC”. Same artwork as public/icons/*.png.
export default function Logo({ size = 40, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" className={`rounded-[22%] shrink-0 ${className}`} role="img" aria-label="HS NPCC LMSC">
      <rect width="512" height="512" fill="#13294b" />
      <circle cx="256" cy="256" r="196" fill="none" stroke="#c99a1e" strokeWidth="6" opacity="0.35" />
      <text x="256" y="196" textAnchor="middle" fontFamily="'Barlow Condensed', sans-serif" fontWeight="600" fontSize="56" letterSpacing="7" fill="#e2b43a">HS · NPCC</text>
      <text x="256" y="338" textAnchor="middle" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="176" letterSpacing="2" fill="#f4f1ea">LMSC</text>
      <rect x="186" y="364" width="140" height="10" rx="5" fill="#e2b43a" />
    </svg>
  )
}
