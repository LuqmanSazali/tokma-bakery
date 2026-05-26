// ══════════════════════════════════════════════════════════════
//  TOKMA BAKERY — Central Configuration
//  Edit this file to update business settings.
//  No coding knowledge needed!
// ══════════════════════════════════════════════════════════════

const config = {

  // ── Business info ────────────────────────────────────────────
  bakery: {
    name:      'Li’iz Patisserie',
    tagline:   'Homemade with love',
    location:  'Kajang, Selangor',
    whatsapp:  '60149333612',
  },

  // ── Baker's location (used as delivery origin on the map) ────
  // To update: Google your address → right-click → "What's here?" → copy coordinates
  bakerLocation: {
    lat: 2.993073625060817,
    lng: 101.82103054563221,
  },

  // ── Delivery zones ───────────────────────────────────────────
  delivery: {
    // Standard zone: up to this distance = normal rate
    standardMaxKm: 5,

    // Extended zone: up to this distance = surcharge applies
    // Beyond this = delivery not available
    extendedMaxKm: 50,

    // RM per km (update when petrol price changes)
    ratePerKm: 0.8,

    // Surcharge multiplier for extended zone (1.5 = 50% extra)
    extendedMultiplier: 1.2,

    // Minimum delivery fee in RM
    minFee: 3.00,

    // Maximum advance booking in months
    maxBookingMonths: 3,
  },

  // ── Social media links ───────────────────────────────────────
  // Replace with real URLs when accounts are created
  social: {
    facebook:  'https://facebook.com/liiz.patisserie',
    instagram: 'https://instagram.com/liiz.patisserie',
    tiktok:    'https://tiktok.com/@liiz.patisserie',
  },

} as const

export default config
