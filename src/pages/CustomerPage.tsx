import { EmptyMessage } from '@openai/apps-sdk-ui/components/EmptyMessage'
import { Heart } from '@openai/apps-sdk-ui/components/Icon'

export function CustomerPage() {
  return (
        <main className="flex min-h-0 flex-1 flex-col py-12 sm:py-20">
          <h1 className="heading-xl">Wishlist</h1>
          <div className="flex flex-1 items-center justify-center">
            <EmptyMessage fill="none">
              <EmptyMessage.Icon size="md">
                <Heart />
              </EmptyMessage.Icon>
              <EmptyMessage.Title>
                Your wishlist is empty
              </EmptyMessage.Title>
              <EmptyMessage.Description>
                Pieces you save will appear here.
              </EmptyMessage.Description>
            </EmptyMessage>
          </div>
        </main>
  )
}
