export type Category = 'cake' | 'bread' | 'pastry' | 'cookies' | 'traditional'

export type ProductStatus = 'available' | 'coming_soon' | 'out_of_stock'

export interface ProductOptionItem {
  label: string
  price?: number  // if set, adds to base price (+RM x.xx)
}

export interface ProductOptionGroup {
  name: string
  multiple?: boolean  // true = multi-select, false/undefined = single select
  items: ProductOptionItem[]
}

export interface Product {
  id: string
  name: string
  price: number          // MYR — 0 means "contact for price"
  images: string[]       // first image is the main/thumbnail
  description: string
  category: Category
  status?: ProductStatus // default = 'available'
  options?: ProductOptionGroup[]
  order?: number         // display order (lower = appears first)
  featured?: boolean     // shows in Seasonal Specials section
  limitedEdition?: boolean  // shows a ribbon badge on the card
}

// Selected option for one group
export interface SelectedOptionGroup {
  name: string
  items: string[]  // selected item labels
}

export interface CartItem {
  product: Product
  quantity: number
  selectedOptions?: SelectedOptionGroup[]
}

export type DeliveryZone = 'standard' | 'extended' | 'unavailable'

export interface DeliveryResult {
  distanceKm: number
  fee: number
  zone: DeliveryZone
}

export interface Customer {
  name: string
  phone: string
  address: string
  deliveryDate: string
}
