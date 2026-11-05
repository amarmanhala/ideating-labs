import { Globe } from '@openai/apps-sdk-ui/components/Icon'

export function SiteFooter() {
  return (
    <footer className="border-t border-default pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
      <div className="flex items-center justify-center gap-2 text-xs text-secondary">
        <Globe aria-hidden="true" className="size-4 shrink-0" />
        <span>English · Canada</span>
      </div>
      <p className="mt-4 text-center text-xs leading-relaxed text-secondary">
        © {new Date().getFullYear()} Ideating Labs. All rights reserved.
      </p>
    </footer>
  )
}
