import { ButtonLink } from '@openai/apps-sdk-ui/components/Button'
import { EmptyMessage } from '@openai/apps-sdk-ui/components/EmptyMessage'
import { Image } from '@openai/apps-sdk-ui/components/Image'
import { ShoppingBag } from '@openai/apps-sdk-ui/components/Icon'
import { CatalogError, CatalogLoading } from '../components/CatalogStatus'
import { useGetOrdersQuery } from '../features/orders/paymentApi'
import type { OrderStatus } from '../types/orders'
import { formatPrice } from '../utils/currency'

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Payment processing',
  paid: 'Paid',
  payment_failed: 'Payment failed',
  expired: 'Checkout expired',
  refunded: 'Refunded',
  partially_refunded: 'Partially refunded',
  fulfilled: 'Fulfilled',
}

export function OrdersPage() {
  const { data: orders = [], isLoading, isError, refetch } = useGetOrdersQuery()

  if (isLoading) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center">
        <CatalogLoading label="Loading your orders…" />
      </main>
    )
  }

  if (isError) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center">
        <CatalogError onRetry={refetch} />
      </main>
    )
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-y-auto py-10 sm:py-14">
      <h1 className="heading-xl">Orders</h1>
      {orders.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyMessage fill="none">
            <EmptyMessage.Icon size="md">
              <ShoppingBag />
            </EmptyMessage.Icon>
            <EmptyMessage.Title>No orders yet</EmptyMessage.Title>
            <EmptyMessage.Description>
              Your purchases will appear here.
            </EmptyMessage.Description>
            <EmptyMessage.ActionRow>
              <ButtonLink to="/shop" color="primary">
                Explore the collection
              </ButtonLink>
            </EmptyMessage.ActionRow>
          </EmptyMessage>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-default p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="heading-sm">Order {order.id.slice(0, 8)}</h2>
                  <p className="mt-1 text-sm text-secondary">
                    {new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium' }).format(
                      new Date(order.createdAt),
                    )}
                    {' · '}
                    {statusLabels[order.status]}
                  </p>
                </div>
                <p className="font-mono text-base">
                  {formatPrice(order.totalMinor, order.currency)}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-4">
                {order.items.map((item) => (
                  <div key={`${item.slug}-${item.size}`} className="flex items-center gap-3">
                    <Image
                      src={item.imageUrl}
                      alt=""
                      className="size-16 object-contain"
                    />
                    <div className="text-sm">
                      <p className="font-mono uppercase">{item.name}</p>
                      <p className="mt-1 text-secondary">
                        Size {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
