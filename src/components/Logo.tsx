export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#0ea5e9"/>
          <stop offset="1" stopColor="#22c55e"/>
        </linearGradient>
      </defs>
      <rect rx="12" ry="12" x="4" y="4" width="56" height="56" fill="url(#g)"/>
      <g fill="#fff">
        <path d="M20 44h12c8 0 14-6 14-14S40 16 32 16H20v28z"/>
        <rect x="24" y="22" width="14" height="4" rx="2"/>
        <rect x="24" y="30" width="18" height="4" rx="2"/>
        <rect x="24" y="38" width="10" height="4" rx="2"/>
      </g>
    </svg>
  )
}
