export default function Header({ title, subtitle }) {
  return (
    <header className="bg-[#1e3a5f] text-white px-4 pt-10 pb-4 sticky top-0 z-10 shadow-md">
      <p className="text-xs font-semibold tracking-widest uppercase text-[#f0c94d] mb-0.5">NPCC</p>
      <h1 className="text-lg font-bold leading-tight">{title}</h1>
      {subtitle && <p className="text-sm text-blue-200 mt-0.5">{subtitle}</p>}
    </header>
  )
}
