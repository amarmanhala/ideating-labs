export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'payment_failed'
  | 'expired'
  | 'refunded'
  | 'partially_refunded'
  | 'fulfilled'

export type OrderItem = {
  slug: string
  name: string
  imageUrl: string
  size: string
  unitPriceMinor: number
  quantity: number
}

export type Order = {
  id: string
  status: OrderStatus
  currency: 'CAD'
  subtotalMinor: number
  shippingMinor: number
  taxMinor: number
  totalMinor: number
  createdAt: string
  paidAt: string | null
  items: OrderItem[]
}

export type OrderListResponse = { data: Order[] }
export type OrderDetailResponse = { data: Order }
export type CheckoutSessionResponse = { data: { url: string } }
