/** Decorative SVG doodles scattered around the page edges */
export default function Doodles() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
      {/* Whisk — top left */}
      <svg className="absolute top-24 left-2 w-10 h-10 opacity-20 rotate-[-20deg]" viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="20" rx="10" ry="16" stroke="#FF4500" strokeWidth="3"/>
        <line x1="32" y1="36" x2="32" y2="60" stroke="#FF4500" strokeWidth="3" strokeLinecap="round"/>
        <line x1="22" y1="12" x2="32" y2="36" stroke="#FF4500" strokeWidth="2"/>
        <line x1="42" y1="12" x2="32" y2="36" stroke="#FF4500" strokeWidth="2"/>
      </svg>

      {/* Rolling pin — top right */}
      <svg className="absolute top-28 right-3 w-14 h-7 opacity-20 rotate-[30deg]" viewBox="0 0 80 32" fill="none">
        <rect x="12" y="10" width="56" height="12" rx="6" fill="#FFC800"/>
        <rect x="0"  y="6"  width="14" height="20" rx="7" fill="#FF4500"/>
        <rect x="66" y="6"  width="14" height="20" rx="7" fill="#FF4500"/>
      </svg>

      {/* Star — left mid */}
      <svg className="absolute top-1/2 left-1 w-8 h-8 opacity-15" viewBox="0 0 32 32" fill="#FF3D7F">
        <polygon points="16,2 20,12 30,12 22,19 25,30 16,23 7,30 10,19 2,12 12,12"/>
      </svg>

      {/* Cake slice — bottom left */}
      <svg className="absolute bottom-32 left-3 w-10 h-10 opacity-20 rotate-[10deg]" viewBox="0 0 64 64" fill="none">
        <path d="M8 52 L32 12 L56 52 Z" fill="#FF8FAB" stroke="#FF3D7F" strokeWidth="2"/>
        <path d="M8 52 Q32 44 56 52" stroke="#FF3D7F" strokeWidth="2" fill="none"/>
        <circle cx="32" cy="10" r="4" fill="#FF4500"/>
      </svg>

      {/* Sprinkles — scattered */}
      {[
        { top: '18%', left: '5%',  color: '#FF4500', rot: '45deg'  },
        { top: '35%', right: '4%', color: '#FFC800', rot: '-30deg' },
        { top: '55%', left: '3%',  color: '#00C853', rot: '60deg'  },
        { top: '70%', right: '5%', color: '#FF3D7F', rot: '20deg'  },
        { top: '82%', left: '6%',  color: '#FF4500', rot: '-45deg' },
        { top: '12%', right: '8%', color: '#00C853', rot: '30deg'  },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute w-5 h-2 rounded-full opacity-30"
          style={{ top: s.top, left: s.left, right: (s as {right?: string}).right, backgroundColor: s.color, transform: `rotate(${s.rot})` }}
        />
      ))}

      {/* Cookie — bottom right */}
      <svg className="absolute bottom-40 right-2 w-10 h-10 opacity-20" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="#FFC800" stroke="#FF4500" strokeWidth="2"/>
        <circle cx="22" cy="26" r="4" fill="#5C3D2E"/>
        <circle cx="38" cy="22" r="3" fill="#5C3D2E"/>
        <circle cx="28" cy="40" r="4" fill="#5C3D2E"/>
        <circle cx="42" cy="38" r="3" fill="#5C3D2E"/>
      </svg>
    </div>
  )
}
