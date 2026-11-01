import { ButtonLink } from '@openai/apps-sdk-ui/components/Button'
import { Image } from '@openai/apps-sdk-ui/components/Image'
import { ArrowRightSm } from '@openai/apps-sdk-ui/components/Icon'
import { Route, Routes } from 'react-router'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { CartPage } from './pages/CartPage'
import { FaqPage } from './pages/FaqPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ShopPage } from './pages/ShopPage'
import { TermsPage } from './pages/TermsPage'

function HomePage() {
  return (
    <div className="h-dvh overflow-hidden bg-surface text-primary">
      <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col px-5 py-3 sm:px-8 sm:py-4 lg:px-12">
        <SiteHeader />

        <main className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] pt-6 sm:pt-10 lg:pt-12">
          <section
            id="studio"
            aria-labelledby="intro-heading"
            className="max-w-2xl"
          >
            <h1 id="intro-heading" className="sr-only">Ideating Labs</h1>
            <p className="text-lg leading-relaxed sm:text-xl lg:text-2xl">
              Creatively designed streetwear inspired by the thoughts we hide,
              the emotions we feel, and the conversations we need to have.
            </p>
            <ButtonLink
              to="/shop"
              color="primary"
              variant="ghost"
              size="md"
              opticallyAlign="start"
              className="mt-2 sm:mt-3"
            >
              Explore more
              <ArrowRightSm />
            </ButtonLink>
          </section>

          <section
            id="collection"
            aria-label="Be Present collection"
            className="mt-5 min-h-0 sm:mt-8 lg:mt-10"
          >
            <Image
              src="/images/ideating-labs-collection.png"
              alt="A minimalist apparel collection featuring a hoodie, T-shirt, socks, quarter-zip, cap, and tote bag with encouraging messages"
              className="h-full min-h-20 w-full object-contain object-center"
            />
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/:slug" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  )
}

export default App
