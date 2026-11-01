import { EmptyMessage } from '@openai/apps-sdk-ui/components/EmptyMessage'
import { Heart, ShoppingBag } from '@openai/apps-sdk-ui/components/Icon'
import { Navigate } from 'react-router'
import { useAppSelector } from '../app/hooks'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'

export function CustomerPage({ type }: { type: 'orders' | 'wishlist' }) {
  const isSignedIn = useAppSelector((state) => state.account.isSignedIn)

  if (!isSignedIn) {
    return <Navigate to="/login" replace />
  }

  const isOrders = type === 'orders'

  return (
    <div className="min-h-dvh bg-surface text-primary">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col px-5 py-3 sm:px-8 sm:py-4 lg:px-12">
        <SiteHeader />

        <main className="flex flex-1 flex-col py-12 sm:py-20">
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

        <SiteFooter />
      </div>
    </div>
  )
}
