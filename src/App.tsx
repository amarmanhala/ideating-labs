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
    <main className="grid min-h-0 flex-1 grid-rows-[auto_auto] pt-6 sm:pt-10 lg:pt-12">
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
        <ButtonLink
          to="/shop"
          color="primary"
          variant="solid"
          size="md"
          className="mt-5 sm:mt-6"
        >
          SHOP NOW
          <ArrowRightSm />
        </ButtonLink>
      </section>

      <section
        id="collection"
        aria-label="Be Present collection"
        className="mt-5 aspect-[8/3] min-h-0 sm:mt-8 lg:mt-10"
      >
        <Image
          src="/images/ideating-labs-collection.png"
          alt="A minimalist apparel collection featuring a hoodie, T-shirt, socks, quarter-zip, cap, and tote bag with encouraging messages"
          className="h-full min-h-20 w-full object-contain object-center"
        />
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
