import { Button } from '@openai/apps-sdk-ui/components/Button'
import { EmptyMessage } from '@openai/apps-sdk-ui/components/EmptyMessage'

export function CatalogLoading({ label }: { label: string }) {
  return (
    <p role="status" className="py-12 text-center text-sm text-secondary">
      {label}
    </p>
  )
}

export function CatalogError({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyMessage fill="none">
      <EmptyMessage.Title>We couldn’t load the collection</EmptyMessage.Title>
      <EmptyMessage.Description>
        Please check your connection and try again.
      </EmptyMessage.Description>
      <EmptyMessage.ActionRow>
        <Button type="button" color="primary" onClick={onRetry}>
          Try again
        </Button>
      </EmptyMessage.ActionRow>
    </EmptyMessage>
  )
}
