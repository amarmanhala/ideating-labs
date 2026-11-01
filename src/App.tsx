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
    <div className="min-h-dvh bg-surface text-primary lg:h-dvh lg:overflow-hidden">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col px-5 py-3 sm:px-8 sm:py-4 lg:h-full lg:min-h-0 lg:px-12">
        <SiteHeader />

        <main className="grid min-h-0 flex-1 grid-rows-[auto_auto] pt-6 sm:pt-10 lg:grid-rows-[auto_minmax(0,1fr)] lg:pt-12">
          <section
            id="studio"
            aria-labelledby="intro-heading"
            className="max-w-3xl"
          >
            <h1 id="intro-heading" className="sr-only">Ideating Labs</h1>
            <p className="text-2xl leading-relaxed sm:text-3xl">
              Creatively designed streetwear inspired by the thoughts we hide,
              the emotions we feel, and the conversations we need to have.
            </p>
            <ButtonLink
              to="/shop"
              color="primary"
              variant="solid"
              size="2xl"
              className="mt-5 min-h-14 px-6 text-base"
            >
              SHOP NOW
              <ArrowRightSm />
            </ButtonLink>
          </section>

          <section
            id="collection"
            aria-label="Be Present collection"
            className="mt-5 min-h-0 sm:mt-8 lg:mt-10"
          >
            <div className="grid sm:hidden">
              <Image
                src="/images/ideating-labs-collection.png"
                alt="A hoodie, T-shirt, and socks with encouraging messages"
                className="aspect-[4/3] w-full object-cover object-left"
              />
              <Image
                src="/images/ideating-labs-collection.png"
                alt="A quarter-zip, cap, and tote bag with encouraging messages"
                className="aspect-[4/3] w-full object-cover object-right"
              />
            </div>
            <Image
              src="/images/ideating-labs-collection.png"
              alt="A minimalist apparel collection featuring a hoodie, T-shirt, socks, quarter-zip, cap, and tote bag with encouraging messages"
              className="hidden w-full object-contain object-center sm:block lg:h-full lg:min-h-20"
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
