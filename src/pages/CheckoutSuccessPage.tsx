import { Alert } from '@openai/apps-sdk-ui/components/Alert'
import { ButtonLink } from '@openai/apps-sdk-ui/components/Button'
import { CheckCircle, ShoppingBag } from '@openai/apps-sdk-ui/components/Icon'
import { Navigate, useSearchParams } from 'react-router'
import { CatalogError, CatalogLoading } from '../components/CatalogStatus'
import { useGetOrderQuery } from '../features/orders/paymentApi'
import { formatPrice } from '../utils/currency'

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order') ?? ''
  const { data: order, isLoading, isError, refetch } = useGetOrderQuery(orderId, {
    skip: !orderId,
    pollingInterval: 2_000,
    skipPollingIfUnfocused: true,
  })

  if (!orderId) return <Navigate to="/orders" replace />

  if (isLoading) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center">
        <CatalogLoading label="Confirming your order…" />
      </main>
    )
  }

  if (isError || !order) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center">
        <CatalogError onRetry={refetch} />
      </main>
    )
  }

  const isPaid = order.status === 'paid' || order.status === 'fulfilled'

  return (
    <main className="flex min-h-0 flex-1 items-center justify-center py-10">
      <div className="w-full max-w-xl">
        {isPaid ? (
          <Alert
            color="success"
            title="Your order is confirmed"
            description="Thank you. Your mindful essentials are now being prepared."
          />
        ) : (
          <Alert
            color="info"
            title="Payment confirmation is processing"
            description="Stripe is confirming your payment. This page will update automatically."
          />
        )}

        <div className="mt-8 rounded-xl border border-default p-6">
          <div className="flex items-center gap-3">
            {isPaid ? <CheckCircle className="size-6" /> : <ShoppingBag className="size-6" />}
            <h1 className="heading-lg">Order {order.id.slice(0, 8)}</h1>
          </div>
          <div className="mt-6 flex justify-between gap-4">
            <span className="text-secondary">Total</span>
            <span className="font-mono">
              {formatPrice(order.totalMinor, order.currency)}
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to="/orders" color="primary">
              View orders
            </ButtonLink>
            <ButtonLink to="/shop" color="secondary" variant="outline">
              Continue shopping
            </ButtonLink>
          </div>
        </div>
      </div>
    </main>
  )
}
