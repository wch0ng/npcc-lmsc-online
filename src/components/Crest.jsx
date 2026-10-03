// Generic shield crest (not an official logo). Also serves as “the school logo”
// on the 2½ Minutes Test paper.
export default function Crest({ size = 40, className = '' }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 40 46" className={className} aria-hidden="true">
      <path d="M20 2 L37 8 V22 C37 33 29 40.5 20 44 C11 40.5 3 33 3 22 V8 Z" fill="#13294b" stroke="#c99a1e" strokeWidth="2.2" />
      <path d="M20 9 l2.6 5.4 5.9.8-4.3 4.1 1 5.8L20 22.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" fill="#e2b43a" />
      <path d="M11 30 h18 M13 34 h14" stroke="#f4f1ea" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
