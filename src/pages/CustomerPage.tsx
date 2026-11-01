import { EmptyMessage } from '@openai/apps-sdk-ui/components/EmptyMessage'
import { Heart, ShoppingBag } from '@openai/apps-sdk-ui/components/Icon'

export function CustomerPage({ type }: { type: 'orders' | 'wishlist' }) {
  const isOrders = type === 'orders'

  return (
        <main className="flex min-h-0 flex-1 flex-col py-12 sm:py-20">
          <h1 className="heading-xl">{isOrders ? 'Orders' : 'Wishlist'}</h1>
          <div className="flex flex-1 items-center justify-center">
            <EmptyMessage fill="none">
              <EmptyMessage.Icon size="md">
                {isOrders ? <ShoppingBag /> : <Heart />}
              </EmptyMessage.Icon>
              <EmptyMessage.Title>
                {isOrders ? 'No orders yet' : 'Your wishlist is empty'}
              </EmptyMessage.Title>
              <EmptyMessage.Description>
                {isOrders
                  ? 'Your purchases will appear here.'
                  : 'Pieces you save will appear here.'}
              </EmptyMessage.Description>
            </EmptyMessage>
          </div>
        </main>
  )
}
