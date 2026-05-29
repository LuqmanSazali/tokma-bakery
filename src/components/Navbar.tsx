import config from '../config'

interface NavbarProps {
  totalItems: number
  onCartClick: () => void
}

const COLORS = ['#FFC800', '#FF3D7F', '#00C853', '#ffffff', '#FFE066', '#B2FF59', '#FF80AB']
const SHAPES = ['▬', '▬', '▬', '●', '●', '✦', '◆', '▬', '▬', '●']

// Seeded pseudo-random for consistent SSR/CSR (no hydration mismatch)
function rand(seed: number): number {
  const x = Math.sin(seed + 1) * 43758.5453123
  return x - Math.floor(x)
}

// 100 confetti pieces — truly random positions, gaussian fade at edges
const CONFETTI = Array.from({ length: 100 }, (_, i) => {
  const leftPct = rand(i * 3)     * 100
  const topPct  = rand(i * 3 + 1) * 100
  // strong bell-curve fade: fully invisible beyond 15% from each edge
  const distFromCenter = Math.abs(leftPct - 50) / 50  // 0=center, 1=edge
  // visible across 80% of width, fades only in the last 10% on each side
  const edgeFade = Math.max(0, 1 - Math.pow(Math.max(0, distFromCenter - 0.8) / 0.2, 2))

  return {
    shape:   SHAPES[Math.floor(rand(i * 3 + 2) * SHAPES.length)],
    top:     `${topPct}%`,
    left:    `${leftPct}%`,
    rot:     `${rand(i * 7) * 180 - 90}deg`,
    color:   COLORS[Math.floor(rand(i * 5) * COLORS.length)],
    size:    9 + Math.floor(rand(i * 11) * 8),
    opacity: edgeFade * 0.92,
  }
})

export default function Navbar({ totalItems, onCartClick }: NavbarProps) {
  return (
    <nav
      className="sticky top-0 z-50 shadow-lg overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FF4500 0%, #FF6A00 100%)' }}
    >
      {/* Confetti layer */}
      <div className="absolute inset-0 pointer-events-none">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="absolute select-none leading-none"
            style={{
              top: c.top,
              left: c.left,
              transform: `rotate(${c.rot})`,
              color: c.color,
              fontSize: c.size,
              opacity: c.opacity,
            }}
          >
            {c.shape}
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/tokma-bakery/images/liiz-patisserie.png" alt="Li'iz Patisserie logo" className="h-10 w-auto drop-shadow" />
          <div className="flex flex-col leading-none px-2 -mx-2 h-16 justify-center" style={{ background: '#FF5500' }}>
            <span className="font-display text-white text-xl tracking-wide drop-shadow">
              {config.bakery.name}
            </span>
            <span className="text-white/70 text-[10px] tracking-widest uppercase">
              {config.bakery.tagline}
            </span>
          </div>
        </div>

        {/* Cart button */}
        <button
          onClick={onCartClick}
          className="relative flex items-center gap-2 bg-white text-primary font-bold px-4 py-2 rounded-full text-sm min-h-[44px] shadow-md hover:shadow-lg active:scale-95 transition-all"
          aria-label={`Cart, ${totalItems} items`}
        >
          🛒
          <span className="hidden sm:inline">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-secondary text-brown text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm animate-bounce">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
