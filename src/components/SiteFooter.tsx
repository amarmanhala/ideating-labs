import { Globe } from '@openai/apps-sdk-ui/components/Icon'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'

export function SiteFooter() {
  return (
    <footer className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pb-3 sm:mt-4 sm:pb-4">
      <p className="text-xs text-secondary">Ideating Labs © 2026</p>

      <nav
        aria-label="Legal"
        className="flex flex-wrap items-center gap-x-6 gap-y-3"
      >
        <TextLink to="/#privacy" underline={false} className="text-xs">Privacy</TextLink>
        <TextLink to="/#terms" underline={false} className="text-xs">Terms</TextLink>
        <TextLink to="/#accessibility" underline={false} className="text-xs">Accessibility</TextLink>
      </nav>

      <div className="flex items-center gap-2 text-xs text-secondary">
        <Globe className="size-4" />
        <span>English · Canada</span>
      </div>
    </footer>
  )
}
