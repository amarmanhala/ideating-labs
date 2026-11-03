import Stripe from 'stripe'
import type {
  CheckoutSessionResponse,
  Order,
  OrderDetailResponse,
  OrderListResponse,
  OrderStatus,
} from '../src/types/orders'
import type { AuthenticatedUser } from './auth'

const shippingMinor = 1_200

type CheckoutCartRow = {
  product_id: number
  slug: string
  name: string
  image_url: string
  price_minor: number
  currency: 'CAD'
  size: string
  quantity: number
}

type OrderRow = {
  id: string
  status: OrderStatus
  currency: 'CAD'
  subtotal_minor: number
  shipping_minor: number
  tax_minor: number
  total_minor: number
  created_at: string
  paid_at: string | null
  product_slug: string | null
  product_name: string | null
  image_url: string | null
  size: string | null
  unit_price_minor: number | null
  quantity: number | null
}

type ExistingCheckoutRow = {
  status: OrderStatus
  stripe_checkout_url: string | null
}

function paymentError(status: number, code: string, message: string) {
  return Response.json(
    { error: { code, message } },
    { status, headers: { 'Cache-Control': 'no-store' } },
  )
}

function getStripe(env: Env) {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured.')
  }
  return new Stripe(env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
    maxNetworkRetries: 2,
  })
}

function storefrontOrigin(request: Request) {
  const origin = request.headers.get('Origin')
  if (
    origin === 'https://ideatinglabs.com' ||
    origin === 'http://127.0.0.1:5173' ||
    origin === 'http://localhost:5173'
  ) {
    return origin
  }
  return new URL(request.url).origin
}

function rowsToOrders(rows: OrderRow[]) {
  const orders = new Map<string, Order>()

  for (const row of rows) {
    let order = orders.get(row.id)
    if (!order) {
      order = {
        id: row.id,
        status: row.status,
        currency: row.currency,
        subtotalMinor: row.subtotal_minor,
        shippingMinor: row.shipping_minor,
        taxMinor: row.tax_minor,
        totalMinor: row.total_minor,
        createdAt: row.created_at,
        paidAt: row.paid_at,
        items: [],
      }
      orders.set(row.id, order)
    }

    if (
      row.product_slug &&
      row.product_name &&
      row.image_url &&
      row.size &&
      row.unit_price_minor !== null &&
      row.quantity !== null
    ) {
      order.items.push({
        slug: row.product_slug,
        name: row.product_name,
        imageUrl: row.image_url,
        size: row.size,
        unitPriceMinor: row.unit_price_minor,
        quantity: row.quantity,
      })
    }
  }

  return [...orders.values()]
}

const selectOrders = `
  SELECT
    o.id,
    o.status,
    o.currency,
    o.subtotal_minor,
    o.shipping_minor,
    o.tax_minor,
    o.total_minor,
    o.created_at,
    o.paid_at,
    oi.product_slug,
    oi.product_name,
    oi.image_url,
    oi.size,
    oi.unit_price_minor,
    oi.quantity
  FROM orders AS o
  LEFT JOIN order_items AS oi ON oi.order_id = o.id
`

async function getOrCreateStripeCustomer(
  stripe: Stripe,
  env: Env,
  user: AuthenticatedUser,
) {
  const existing = await env.DB.prepare(
    'SELECT stripe_customer_id FROM stripe_customers WHERE user_id = ? LIMIT 1',
  )
    .bind(user.id)
    .first<{ stripe_customer_id: string }>()
  if (existing) return existing.stripe_customer_id

  const customer = await stripe.customers.create(
    {
      email: user.email,
      metadata: { supabase_user_id: user.id },
    },
    { idempotencyKey: `customer:${user.id}` },
  )

  await env.DB.prepare(
    `INSERT INTO stripe_customers (user_id, stripe_customer_id, email)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       stripe_customer_id = excluded.stripe_customer_id,
       email = excluded.email,
       updated_at = datetime('now')`,
  )
    .bind(user.id, customer.id, user.email)
    .run()

  return customer.id
}

function parseCheckoutKey(value: unknown) {
  if (!value || typeof value !== 'object') return null
  const checkoutKey = (value as { checkoutKey?: unknown }).checkoutKey
  if (
    typeof checkoutKey !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      checkoutKey,
    )
  ) {
    return null
  }
  return checkoutKey
}

export async function createCheckoutSession(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
) {
  if (!env.STRIPE_SECRET_KEY) {
    return paymentError(
      503,
      'PAYMENTS_NOT_CONFIGURED',
      'Checkout is not available yet.',
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return paymentError(400, 'INVALID_JSON', 'Checkout details must be valid JSON.')
  }

  const checkoutKey = parseCheckoutKey(body)
  if (!checkoutKey) {
    return paymentError(400, 'INVALID_CHECKOUT_KEY', 'Checkout could not be started.')
  }

  const existing = await env.DB.prepare(
    `SELECT status, stripe_checkout_url
     FROM orders WHERE checkout_key = ? AND user_id = ? LIMIT 1`,
  )
    .bind(checkoutKey, user.id)
    .first<ExistingCheckoutRow>()
  if (existing?.status === 'pending' && existing.stripe_checkout_url) {
    return Response.json(
      { data: { url: existing.stripe_checkout_url } } satisfies CheckoutSessionResponse,
      { headers: { 'Cache-Control': 'no-store' } },
    )
  }
  if (existing) {
    return paymentError(409, 'CHECKOUT_ALREADY_USED', 'Please start a new checkout.')
  }

  const cart = await env.DB.prepare(
    `SELECT
       ci.product_id,
       p.slug,
       p.name,
       p.image_url,
       p.price_minor,
       p.currency,
       ci.size,
       ci.quantity
     FROM cart_items AS ci
     INNER JOIN products AS p ON p.id = ci.product_id
     INNER JOIN product_sizes AS ps
       ON ps.product_id = ci.product_id AND ps.size = ci.size
     WHERE ci.user_id = ? AND p.is_active = 1
     ORDER BY p.display_order, p.id`,
  )
    .bind(user.id)
    .all<CheckoutCartRow>()

  if (cart.results.length === 0) {
    return paymentError(400, 'EMPTY_CART', 'Your cart is empty.')
  }

  const subtotalMinor = cart.results.reduce(
    (total, item) => total + item.price_minor * item.quantity,
    0,
  )
  const orderId = crypto.randomUUID()
  const stripe = getStripe(env)
  const stripeCustomerId = await getOrCreateStripeCustomer(stripe, env, user)

  const orderStatement = env.DB.prepare(
    `INSERT INTO orders (
       id, user_id, checkout_key, stripe_customer_id, customer_email,
       subtotal_minor, shipping_minor, tax_minor, total_minor
     ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
  ).bind(
    orderId,
    user.id,
    checkoutKey,
    stripeCustomerId,
    user.email,
    subtotalMinor,
    shippingMinor,
    subtotalMinor + shippingMinor,
  )
  const itemStatements = cart.results.map((item) =>
    env.DB.prepare(
      `INSERT INTO order_items (
         order_id, product_id, product_slug, product_name, image_url,
         size, unit_price_minor, quantity
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      orderId,
      item.product_id,
      item.slug,
      item.name,
      item.image_url,
      item.size,
      item.price_minor,
      item.quantity,
    ),
  )
  await env.DB.batch([orderStatement, ...itemStatements])

  const origin = storefrontOrigin(request)
  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        customer: stripeCustomerId,
        customer_update: { shipping: 'auto' },
        client_reference_id: orderId,
        metadata: { order_id: orderId },
        allowed_payment_method_types: ['card'],
        line_items: cart.results.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: 'cad',
            unit_amount: item.price_minor,
            product_data: {
              name: `${item.name} — ${item.size}`,
              images: [new URL(item.image_url, 'https://ideatinglabs.com').toString()],
              metadata: {
                product_slug: item.slug,
                size: item.size,
              },
            },
          },
        })),
        automatic_tax: { enabled: true },
        shipping_address_collection: { allowed_countries: ['CA'] },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              display_name: 'Standard shipping',
              fixed_amount: { amount: shippingMinor, currency: 'cad' },
            },
          },
        ],
        success_url: `${origin}/checkout/success?order=${encodeURIComponent(orderId)}`,
        cancel_url: `${origin}/cart`,
      },
      { idempotencyKey: `checkout:${checkoutKey}` },
    )

    if (!session.url) throw new Error('Stripe did not return a Checkout URL.')

    await env.DB.prepare(
      `UPDATE orders SET
         stripe_checkout_session_id = ?,
         stripe_checkout_url = ?,
         updated_at = datetime('now')
       WHERE id = ? AND user_id = ?`,
    )
      .bind(session.id, session.url, orderId, user.id)
      .run()

    return Response.json(
      { data: { url: session.url } } satisfies CheckoutSessionResponse,
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    await env.DB.prepare(
      `UPDATE orders SET status = 'payment_failed', updated_at = datetime('now')
       WHERE id = ? AND status = 'pending'`,
    )
      .bind(orderId)
      .run()
    throw error
  }
}

export async function listOrders(env: Env, user: AuthenticatedUser) {
  const result = await env.DB.prepare(
    `${selectOrders}
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC, oi.rowid`,
  )
    .bind(user.id)
    .all<OrderRow>()

  return Response.json(
    { data: rowsToOrders(result.results) } satisfies OrderListResponse,
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

export async function getOrder(
  orderId: string,
  env: Env,
  user: AuthenticatedUser,
) {
  const result = await env.DB.prepare(
    `${selectOrders}
     WHERE o.id = ? AND o.user_id = ?
     ORDER BY oi.rowid`,
  )
    .bind(orderId, user.id)
    .all<OrderRow>()
  const order = rowsToOrders(result.results)[0]
  if (!order) return paymentError(404, 'ORDER_NOT_FOUND', 'Order not found.')

  return Response.json(
    { data: order } satisfies OrderDetailResponse,
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

function paymentIntentId(value: string | Stripe.PaymentIntent | null) {
  if (!value) return null
  return typeof value === 'string' ? value : value.id
}

async function sessionEventStatements(
  session: Stripe.Checkout.Session,
  eventType: string,
  env: Env,
) {
  const orderId = session.client_reference_id ?? session.metadata?.order_id
  if (!orderId) return []

  if (eventType === 'checkout.session.expired') {
    return [
      env.DB.prepare(
        `UPDATE orders SET status = 'expired', updated_at = datetime('now')
         WHERE id = ? AND status = 'pending'`,
      ).bind(orderId),
    ]
  }

  if (eventType === 'checkout.session.async_payment_failed') {
    return [
      env.DB.prepare(
        `UPDATE orders SET status = 'payment_failed', updated_at = datetime('now')
         WHERE id = ? AND status = 'pending'`,
      ).bind(orderId),
    ]
  }

  const isPaid =
    session.payment_status === 'paid' ||
    eventType === 'checkout.session.async_payment_succeeded'
  if (!isPaid) return []

  const shipping = session.collected_information?.shipping_details
  const address = shipping?.address
  const statements: D1PreparedStatement[] = [
    env.DB.prepare(
      `UPDATE orders SET
         status = 'paid',
         stripe_payment_intent_id = ?,
         customer_email = ?,
         subtotal_minor = ?,
         shipping_minor = ?,
         tax_minor = ?,
         total_minor = ?,
         shipping_name = ?,
         shipping_line1 = ?,
         shipping_line2 = ?,
         shipping_city = ?,
         shipping_province = ?,
         shipping_postal_code = ?,
         shipping_country = ?,
         paid_at = COALESCE(paid_at, datetime('now')),
         updated_at = datetime('now')
       WHERE id = ? AND status IN ('pending', 'payment_failed')`,
    ).bind(
      paymentIntentId(session.payment_intent),
      session.customer_details?.email,
      session.amount_subtotal ?? 0,
      session.total_details?.amount_shipping ?? shippingMinor,
      session.total_details?.amount_tax ?? 0,
      session.amount_total ?? 0,
      shipping?.name,
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
      orderId,
    ),
  ]

  const purchased = await env.DB.prepare(
    `SELECT o.user_id, oi.product_id, oi.size, oi.quantity
     FROM orders AS o
     INNER JOIN order_items AS oi ON oi.order_id = o.id
     WHERE o.id = ?`,
  )
    .bind(orderId)
    .all<{ user_id: string; product_id: number; size: string; quantity: number }>()

  for (const item of purchased.results) {
    statements.push(
      env.DB.prepare(
        `DELETE FROM cart_items
         WHERE user_id = ? AND product_id = ? AND size = ? AND quantity = ?`,
      ).bind(item.user_id, item.product_id, item.size, item.quantity),
    )
  }

  return statements
}

export async function handleStripeWebhook(request: Request, env: Env) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return paymentError(503, 'PAYMENTS_NOT_CONFIGURED', 'Payments are not configured.')
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return paymentError(400, 'MISSING_SIGNATURE', 'Webhook signature is required.')
  }

  const stripe = getStripe(env)
  const rawBody = await request.text()
  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    )
  } catch {
    return paymentError(400, 'INVALID_SIGNATURE', 'Webhook signature is invalid.')
  }

  const processed = await env.DB.prepare(
    'SELECT event_id FROM stripe_webhook_events WHERE event_id = ? LIMIT 1',
  )
    .bind(event.id)
    .first<{ event_id: string }>()
  if (processed) return Response.json({ received: true })

  let statements: D1PreparedStatement[] = []
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded' ||
    event.type === 'checkout.session.async_payment_failed' ||
    event.type === 'checkout.session.expired'
  ) {
    statements = await sessionEventStatements(event.data.object, event.type, env)
  } else if (event.type === 'charge.refunded') {
    const charge = event.data.object
    const intentId = paymentIntentId(charge.payment_intent)
    if (intentId) {
      const status =
        charge.amount_refunded >= charge.amount
          ? 'refunded'
          : 'partially_refunded'
      statements.push(
        env.DB.prepare(
          `UPDATE orders SET status = ?, updated_at = datetime('now')
           WHERE stripe_payment_intent_id = ?
             AND status IN ('paid', 'fulfilled', 'partially_refunded')`,
        ).bind(status, intentId),
      )
    }
  }

  statements.push(
    env.DB.prepare(
      `INSERT INTO stripe_webhook_events (event_id, event_type) VALUES (?, ?)`,
    ).bind(event.id, event.type),
  )
  await env.DB.batch(statements)

  return Response.json({ received: true })
}
