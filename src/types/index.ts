export type Category = 'cake' | 'bread' | 'pastry' | 'cookies'

export interface Product {
  id: string
  name: string
  price: number       // MYR
  images: string[]    // first image is the main/thumbnail
  description: string
  category: Category
  order?: number            // display order (lower = appears first)
  featured?: boolean        // shows in Seasonal Specials section
  limitedEdition?: boolean  // shows a ribbon badge on the card
}

export interface CartItem {
  product: Product
  quantity: number
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
