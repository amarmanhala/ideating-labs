import { ButtonLink } from '@openai/apps-sdk-ui/components/Button'
import { Image } from '@openai/apps-sdk-ui/components/Image'
import { ArrowRightSm } from '@openai/apps-sdk-ui/components/Icon'
import { Navigate, Route, Routes } from 'react-router'
import { ProtectedRoute } from './components/ProtectedRoute'
import { StorefrontLayout } from './components/StorefrontLayout'
import { AccountPage } from './pages/AccountPage'
import { AboutPage } from './pages/AboutPage'
import { AdminPage } from './pages/AdminPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { CartPage } from './pages/CartPage'
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage'
import { CustomerPage } from './pages/CustomerPage'
import { FaqPage } from './pages/FaqPage'
import { LegalPage } from './pages/LegalPage'
import { OrdersPage } from './pages/OrdersPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ShopPage } from './pages/ShopPage'

function HomePage() {
  return (
    <main className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] pt-4 sm:pt-6 lg:pt-8">
      <section
        id="studio"
        aria-labelledby="intro-heading"
        className="max-w-2xl"
      >
        <h1 id="intro-heading" className="sr-only">
          Ideating Labs
        </h1>
        <p className="text-lg leading-relaxed sm:text-xl lg:text-2xl">
          Creatively designed streetwear inspired by the thoughts we hide, the
          emotions we feel, and the conversations we need to have.
        </p>
      </section>

      <section
        id="collection"
        aria-label="Project Overthinking — coming soon"
        className="mt-4 min-h-0 overflow-hidden sm:mt-6"
      >
        <figure className="relative h-full w-full">
          <Image
            src="/images/project-overthinking-drop.png"
            alt="Project Overthinking: a thoughtful model in dark streetwear on a New York street, surrounded by motion-blurred pedestrians"
            fetchPriority="high"
            className="h-full w-full object-cover object-[50%_30%]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-4 flex flex-col items-center px-4 text-center text-white sm:bottom-6">
            <h2 className="font-mono text-[clamp(1.5rem,4vw,3.5rem)] leading-tight tracking-[0.12em] uppercase">
              <span className="block">Project</span>
              <span className="block">Overthinking</span>
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] sm:text-sm">
              Coming Soon
            </p>
            <ButtonLink
              to="/shop"
              color="primary"
              variant="solid"
              size="md"
              className="mt-4 border border-white/30"
            >
              SHOP NOW
              <ArrowRightSm />
            </ButtonLink>
          </figcaption>
        </figure>
      </section>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:slug" element={<ProductDetailPage />} />
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<AccountPage mode="login" />} />
        <Route path="signup" element={<AccountPage mode="signup" />} />
        <Route path="auth/callback" element={<AuthCallbackPage />} />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout/success"
          element={
            <ProtectedRoute>
              <CheckoutSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="wishlist"
          element={
            <ProtectedRoute>
              <CustomerPage />
            </ProtectedRoute>
          }
        />
        <Route path="about" element={<AboutPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="legal" element={<LegalPage />} />
        <Route
          path="privacy"
          element={<Navigate to="/legal#privacy-policy" replace />}
        />
        <Route
          path="terms"
          element={<Navigate to="/legal#terms-of-use" replace />}
        />
      </Route>
      <Route path="/admin/*" element={<AdminPage />} />
    </Routes>
  )
}

export default App
