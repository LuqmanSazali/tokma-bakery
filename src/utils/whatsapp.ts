import config from '../config'
import type { CartItem, Customer, DeliveryResult } from '../types'
import { calcItemPrice, formatOptions } from './product'

const WHATSAPP_NUMBER = config.bakery.whatsapp

function formatPrice(amount: number): string {
  return `RM ${amount.toFixed(2)}`
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export function buildWhatsAppUrl(
  items: CartItem[],
  customer: Customer,
  delivery: DeliveryResult,
  pinnedLocation?: [number, number] | null,
): string {
  const lines: string[] = []

  const subtotal = items.reduce((sum, item) =>
    sum + calcItemPrice(item.product, item.selectedOptions) * item.quantity, 0)
  const total = subtotal + delivery.fee

  const now = new Date()
  const hours = now.getHours()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hours12 = String(hours % 12 || 12).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const receiptDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}, ${hours12}:${minutes} ${ampm}`

  lines.push(`🍞 *New Order — ${config.bakery.name}*`)
  lines.push('─────────────────────────')
  lines.push(`*Name*         : ${customer.name}`)
  lines.push(`*Phone*        : ${customer.phone}`)
  lines.push(`*Location*     : ${customer.address}`)
  if (pinnedLocation) {
    const [lat, lng] = pinnedLocation
    lines.push(`*Maps*         : https://www.google.com/maps?q=${lat},${lng}`)
  }
  lines.push(`*Delivery Date*: ${formatDate(customer.deliveryDate)}`)
  lines.push('*Order Details*:')
  items.forEach(({ product, quantity, selectedOptions }) => {
    const itemPrice = calcItemPrice(product, selectedOptions)
    const priceNote = product.price === 0 ? 'Contact for price' : formatPrice(itemPrice * quantity)
    lines.push(`  • ${product.name} x${quantity} — ${priceNote}`)
    // Sub-bullets for each option group
    selectedOptions?.forEach(group => {
      if (group.items.length > 0) {
        lines.push(`      ↳ ${group.name}: ${group.items.join(', ')}`)
      }
    })
  })
  lines.push(`*Subtotal*      : ${formatPrice(subtotal)}`)
  lines.push(`*Delivery Fee*  : ${formatPrice(delivery.fee)} (${delivery.distanceKm.toFixed(1)} km)`)
  lines.push(`*Total Payment* : ${formatPrice(total)}`)
  lines.push(`*Agent*         : -`)
  lines.push('─────────────────────────')
  lines.push(`_Receipt Date: ${receiptDate}_`)
  lines.push(`_Sent via ${config.bakery.name} website_ 🎀`)

  const message = lines.join('\n')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
