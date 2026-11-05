import { Globe } from '@openai/apps-sdk-ui/components/Icon'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { CookiePreferences } from './CookiePreferences'

const footerLinkClassName = 'flex min-h-11 items-center py-2 text-sm text-secondary sm:text-base'

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-default pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 sm:mt-16 sm:pt-12">
      <div className="mx-auto grid w-full max-w-4xl grid-cols-2 items-start gap-x-6 gap-y-10 sm:gap-x-20 sm:gap-y-12">
        <section aria-labelledby="footer-account">
          <h2 id="footer-account" className="mb-4 text-base font-semibold sm:text-xl">
            Your account
          </h2>
          <nav aria-label="Account">
            <TextLink to="/login" underline={false} className={footerLinkClassName}>Login</TextLink>
            <TextLink to="/signup" underline={false} className={footerLinkClassName}>Sign Up</TextLink>
            <TextLink to="/wishlist" underline={false} className={footerLinkClassName}>Wishlist</TextLink>
          </nav>
        </section>

        <section aria-labelledby="footer-brand" className="row-span-2">
          <h2 id="footer-brand" className="mb-4 text-base font-semibold sm:text-xl">
            We are Ideating Labs
          </h2>
          <nav aria-label="About Ideating Labs">
            <TextLink to="/about" underline={false} className={footerLinkClassName}>Our story</TextLink>
            <TextLink to="/shop" underline={false} className={footerLinkClassName}>Shop the collection</TextLink>
            <TextLink to="/legal#terms-of-use" underline={false} className={footerLinkClassName}>Terms</TextLink>
            <TextLink to="/legal#privacy-policy" underline={false} className={footerLinkClassName}>Privacy</TextLink>
            <div className="flex min-h-11 items-center [&>button]:h-auto [&>button]:min-h-11 [&>button]:whitespace-normal [&>button]:text-left [&>button]:text-sm sm:[&>button]:text-base">
              <CookiePreferences />
            </div>
          </nav>
        </section>

        <section aria-labelledby="footer-support">
          <h2 id="footer-support" className="mb-4 text-base font-semibold sm:text-xl">
            Order support
          </h2>
          <nav aria-label="Order support">
            <TextLink to="/orders" underline={false} className={footerLinkClassName}>Your orders</TextLink>
            <TextLink to="/legal#terms-returns" underline={false} className={footerLinkClassName}>Returns &amp; exchanges</TextLink>
            <TextLink to="/legal#terms-shipping" underline={false} className={footerLinkClassName}>Shipping policy</TextLink>
            <TextLink to="/faq" underline={false} className={footerLinkClassName}>FAQs</TextLink>
          </nav>
        </section>
      </div>

      <div className="mt-10 flex items-center justify-center gap-2 text-xs text-secondary">
        <Globe aria-hidden="true" className="size-4 shrink-0" />
        <span>English · Canada</span>
      </div>
      <p className="mt-4 text-center text-xs leading-relaxed text-secondary">
        © {new Date().getFullYear()} Ideating Labs. All rights reserved.
      </p>
    </footer>
  )
}
