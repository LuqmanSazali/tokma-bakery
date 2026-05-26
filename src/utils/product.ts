import type { Product, SelectedOptionGroup } from '../types'

/** Calculate item price including any option add-ons */
export function calcItemPrice(product: Product, selectedOptions?: SelectedOptionGroup[]): number {
  let total = product.price
  if (!selectedOptions) return total
  for (const group of selectedOptions) {
    const optGroup = product.options?.find(o => o.name === group.name)
    if (!optGroup) continue
    for (const label of group.items) {
      const item = optGroup.items.find(i => i.label === label)
      if (item?.price) total += item.price
    }
  }
  return total
}

/** Format selected options as a readable string for display */
export function formatOptions(selectedOptions?: SelectedOptionGroup[]): string {
  if (!selectedOptions?.length) return ''
  return selectedOptions
    .filter(g => g.items.length > 0)
    .map(g => `${g.name}: ${g.items.join(', ')}`)
    .join(' | ')
}
