import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { PrivacyPage } from './PrivacyPage'
import { TermsPage } from './TermsPage'

export function LegalPage() {
  return (
    <main className="flex-1">
      <h1 className="sr-only">Terms and Privacy</h1>
      <nav
        aria-label="Legal documents"
        className="flex flex-wrap gap-6 pt-12 text-sm sm:pt-16"
      >
        <TextLink to="#terms-of-use">Terms of Use</TextLink>
        <TextLink to="#privacy-policy">Privacy Policy</TextLink>
      </nav>
      <TermsPage />
      <PrivacyPage />
    </main>
  )
}
