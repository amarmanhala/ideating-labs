import type { ShopCategory } from '../features/shop/shopSlice'

export type Product = {
  slug: string
  name: string
  price: string
  category: Exclude<ShopCategory, 'All'>
  image: string
  description: string
  materials: string
  fit: string
  sizes: string[]
}

export const products: Product[] = [
  {
    slug: 'one-thing-tee',
    name: 'ONE THING TEE',
    price: '$42.00',
    category: 'Tops',
    image: '/images/products/one-thing-tee.png',
    description:
      'A heavyweight everyday tee for busy minds. The front carries a simple prompt to return to what is in front of you—one thing, one breath, one moment at a time.',
    materials: '100% heavyweight combed cotton. Machine wash cold and hang dry.',
    fit: 'Relaxed, oversized fit with dropped shoulders. Size down for a closer fit.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    slug: 'breathe-hoodie',
    name: 'BREATHE HOODIE',
    price: '$88.00',
    category: 'Outerwear',
    image: '/images/products/breathe-hoodie.png',
    description:
      'A soft, substantial hoodie designed as a wearable pause. The quiet chest reminder is there when the day feels loud: breathe, notice, begin again.',
    materials: 'Heavyweight cotton fleece with a brushed interior. Wash cold with like colors.',
    fit: 'Roomy unisex fit with a structured hood and relaxed sleeves.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    slug: 'better-days-half-zip',
    name: 'BETTER DAYS HALF ZIP',
    price: '$96.00',
    category: 'Outerwear',
    image: '/images/products/better-days-quarter-zip.png',
    description:
      'A clean quarter-zip for the in-between days. Better days ahead is printed close to the heart—a small statement of perspective, not pressure.',
    materials: 'Dense cotton-blend fleece with a metal quarter zip. Gentle cycle and air dry.',
    fit: 'Relaxed through the body with a slightly cropped, structured hem.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    slug: 'be-here-socks',
    name: 'BE HERE SOCKS',
    price: '$18.00',
    category: 'Accessories',
    image: '/images/products/be-here-socks.png',
    description:
      'Two reminders for wherever your feet take you: breathe and be here. Cushioned, comfortable, and made for ordinary days that ask a lot of you.',
    materials: 'Combed cotton blend with a cushioned sole. Machine wash cold.',
    fit: 'Ribbed crew length with a flexible unisex fit.',
    sizes: ['S/M', 'L/XL'],
  },
  {
    slug: 'be-present-cap',
    name: 'BE PRESENT CAP',
    price: '$32.00',
    category: 'Accessories',
    image: '/images/products/be-present-cap.png',
    description:
      'A familiar silhouette with a direct message. Put it on when you need a visible cue to step out of the mental noise and back into the moment.',
    materials: 'Cotton front panel, recycled mesh back, and adjustable snap closure. Spot clean.',
    fit: 'One size with an adjustable back closure.',
    sizes: ['OS'],
  },
  {
    slug: 'kinder-thoughts-tote',
    name: 'KINDER THOUGHTS TOTE',
    price: '$54.00',
    category: 'Objects',
    image: '/images/products/kinder-thoughts-tote.png',
    description:
      'A roomy everyday carry with space for the practical things—and a reminder to make a little less room for self-criticism.',
    materials: 'Heavyweight cotton canvas with reinforced handles. Spot clean only.',
    fit: 'One size. Fits a laptop, notebook, water bottle, and daily essentials.',
    sizes: ['OS'],
  },
]
