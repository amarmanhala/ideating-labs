import { Outlet, useLocation } from 'react-router'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function StorefrontLayout() {
  const { pathname } = useLocation()
  const usesViewportHeight =
    pathname === '/' ||
    pathname === '/cart' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/auth/callback' ||
    pathname === '/orders' ||
    pathname === '/wishlist' ||
    /^\/shop\/[^/]+$/.test(pathname)

  return (
    <div
      className={
        usesViewportHeight
          ? 'h-dvh overflow-hidden bg-surface text-primary'
          : 'min-h-dvh bg-surface text-primary'
      }
    >
      <div
        className={`mx-auto flex w-full max-w-[1600px] flex-col px-5 py-3 sm:px-8 sm:py-4 lg:px-12 ${
          usesViewportHeight ? 'h-full' : 'min-h-dvh'
        }`}
      >
        <SiteHeader />
        <Outlet />
        <SiteFooter />
      </div>
    </div>
  )
}
