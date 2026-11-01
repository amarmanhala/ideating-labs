import { Globe } from '@openai/apps-sdk-ui/components/Icon'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { CookiePreferences } from './CookiePreferences'

export function SiteFooter() {
  return (
    <footer className="mt-6 grid grid-cols-2 items-center gap-x-4 gap-y-3 border-t border-default pb-3 pt-3 sm:mt-4 sm:flex sm:flex-wrap sm:justify-between sm:gap-x-6 sm:gap-y-2 sm:border-0 sm:pb-4 sm:pt-0">
      <p className="order-2 text-xs text-secondary sm:order-none">Ideating Labs © 2026</p>

      <nav
        aria-label="Legal"
        className="order-1 col-span-2 grid grid-cols-2 items-center gap-x-4 sm:order-none sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-3 [&>a]:inline-flex [&>a]:min-h-11 [&>a]:items-center [&>button]:min-h-11 [&>button]:justify-self-start sm:[&>a]:min-h-0 sm:[&>button]:min-h-0"
      >
        <CookiePreferences />
        <TextLink to="/privacy" underline={false} className="text-xs">Privacy</TextLink>
        <TextLink to="/terms" underline={false} className="text-xs">Terms</TextLink>
        <TextLink to="/#accessibility" underline={false} className="text-xs">Accessibility</TextLink>
      </nav>

      <div className="order-3 flex items-center justify-end gap-2 text-xs text-secondary sm:order-none">
        <Globe aria-hidden="true" className="size-4 shrink-0" />
        <span>English · Canada</span>
      </div>
    </footer>
  )
}
