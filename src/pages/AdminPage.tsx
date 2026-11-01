import { Badge } from '@openai/apps-sdk-ui/components/Badge'
import { Button } from '@openai/apps-sdk-ui/components/Button'
import { EmptyMessage } from '@openai/apps-sdk-ui/components/EmptyMessage'
import {
  Analytics,
  Bell,
  Home,
  MenuSidebar,
  Order,
  Plus,
  ProductTag,
  Search,
  SidebarCollapseLeft,
  SidebarCollapseRight,
  Tag,
  Users,
} from '@openai/apps-sdk-ui/components/Icon'
import { Image } from '@openai/apps-sdk-ui/components/Image'
import { Input } from '@openai/apps-sdk-ui/components/Input'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { AdminProductForm } from '../components/AdminProductForm'
import { CatalogError, CatalogLoading } from '../components/CatalogStatus'
import { useGetProductsQuery } from '../features/catalog/catalogApi'
import { formatPrice } from '../utils/currency'

type AdminSection =
  | 'Home'
  | 'Orders'
  | 'Products'
  | 'Customers'
  | 'Analytics'
  | 'Marketing'
  | 'Discounts'

const navigationItems = [
  { label: 'Home' as const, icon: Home },
  { label: 'Orders' as const, icon: Order },
  { label: 'Products' as const, icon: ProductTag },
  { label: 'Customers' as const, icon: Users },
  { label: 'Analytics' as const, icon: Analytics },
  { label: 'Marketing' as const, icon: Bell },
  { label: 'Discounts' as const, icon: Tag },
]

export function AdminPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedSection, setSelectedSection] = useState<AdminSection>('Home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const activeSection: AdminSection = location.pathname.startsWith(
    '/admin/products',
  )
    ? 'Products'
    : selectedSection
  const isAddingProduct = location.pathname === '/admin/products/new'
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useGetProductsQuery(undefined, {
    skip: activeSection !== 'Home' && activeSection !== 'Products',
  })

  const overviewItems = [
    {
      label: 'Products' as const,
      value: productsLoading ? '—' : String(products.length),
      description: 'Active products',
      icon: ProductTag,
    },
    {
      label: 'Customers' as const,
      value: '0',
      description: 'Total customers',
      icon: Users,
    },
    {
      label: 'Orders' as const,
      value: '0',
      description: 'Total orders',
      icon: Order,
    },
  ]

  const selectSection = (section: AdminSection) => {
    setSelectedSection(section)
    setSidebarOpen(false)
    if (section === 'Products') {
      navigate('/admin/products')
    } else if (location.pathname !== '/admin') {
      navigate('/admin')
    }
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-surface text-primary">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-40 flex border-r border-default bg-surface transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'w-20' : 'w-72'}`}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-3">
          <div className="flex min-h-10 items-center justify-between gap-2 px-2">
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="truncate font-semibold">Ideating Labs</p>
                <p className="truncate text-sm text-secondary">Store admin</p>
              </div>
            )}
            <Button
              type="button"
              color="secondary"
              variant="ghost"
              size="lg"
              uniform
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            >
              {sidebarCollapsed ? (
                <SidebarCollapseRight />
              ) : (
                <SidebarCollapseLeft />
              )}
            </Button>
          </div>

          {!sidebarCollapsed && (
            <Input
              aria-label="Search admin"
              placeholder="Search"
              size="xl"
              startAdornment={<Search />}
            />
          )}

          <nav className="flex flex-col gap-1">
            {navigationItems.map((item) => {
              const ItemIcon = item.icon

              return (
                <Button
                  key={item.label}
                  type="button"
                  color="secondary"
                  variant="ghost"
                  size="xl"
                  pill={false}
                  block
                  uniform={sidebarCollapsed}
                  selected={activeSection === item.label}
                  aria-current={activeSection === item.label ? 'page' : undefined}
                  aria-label={sidebarCollapsed ? item.label : undefined}
                  onClick={() => selectSection(item.label)}
                >
                  {sidebarCollapsed ? (
                    <ItemIcon />
                  ) : (
                    <span className="flex w-full items-center justify-start gap-2 text-left">
                      <ItemIcon />
                      <span>{item.label}</span>
                    </span>
                  )}
                </Button>
              )
            })}
          </nav>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-16 items-center gap-3 border-b border-default px-5 lg:hidden">
          <Button
            type="button"
            color="secondary"
            variant="ghost"
            size="lg"
            uniform
            aria-label="Open admin navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuSidebar />
          </Button>
          <span className="font-semibold">Ideating Labs</span>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8 lg:p-12">
          <div className="mx-auto w-full max-w-6xl">
            <h1 className="heading-3xl">{activeSection}</h1>

            {activeSection === 'Home' ? (
              <div className="mt-10 space-y-12">
                <section aria-labelledby="overview-heading">
                  <h2 id="overview-heading" className="heading-lg">
                    Overview
                  </h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {overviewItems.map((item) => {
                      const ItemIcon = item.icon

                      return (
                        <Button
                          key={item.label}
                          type="button"
                          color="secondary"
                          variant="outline"
                          pill={false}
                          block
                          className="h-36 items-start justify-start p-5 text-left"
                          onClick={() => selectSection(item.label)}
                        >
                          <span className="flex h-full flex-col items-start justify-between">
                            <span className="flex items-center gap-2 font-semibold">
                              <ItemIcon />
                              {item.label}
                            </span>
                            <span>
                              <span className="block text-3xl font-semibold text-primary">
                                {item.value}
                              </span>
                              <span className="block text-sm font-normal text-secondary">
                                {item.description}
                              </span>
                            </span>
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                </section>

                <section aria-labelledby="activity-heading">
                  <h2 id="activity-heading" className="heading-lg">
                    Store activity
                  </h2>
                  <EmptyMessage fill="none" className="mt-8">
                    <EmptyMessage.Title>No activity yet</EmptyMessage.Title>
                    <EmptyMessage.Description>
                      New orders and customer activity will appear here.
                    </EmptyMessage.Description>
                  </EmptyMessage>
                </section>
              </div>
            ) : activeSection === 'Products' && isAddingProduct ? (
              <AdminProductForm onCancel={() => navigate('/admin/products')} />
            ) : activeSection === 'Products' ? (
              <section className="mt-10" aria-labelledby="products-heading">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 id="products-heading" className="heading-lg">
                      All products
                    </h2>
                    <p className="mt-1 text-sm text-secondary">
                      Products currently stored in the Cloudflare catalog.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {!productsLoading && !productsError && (
                      <Badge color="secondary" variant="soft" size="md">
                        {products.length}{' '}
                        {products.length === 1 ? 'product' : 'products'}
                      </Badge>
                    )}
                    <Button
                      type="button"
                      color="primary"
                      variant="solid"
                      onClick={() => navigate('/admin/products/new')}
                    >
                      <Plus />
                      Add product
                    </Button>
                  </div>
                </div>

                {productsLoading && <CatalogLoading label="Loading products…" />}
                {productsError && (
                  <div className="mt-12">
                    <CatalogError onRetry={refetchProducts} />
                  </div>
                )}
                {!productsLoading && !productsError && products.length === 0 && (
                  <EmptyMessage fill="none" className="mt-12">
                    <EmptyMessage.Title>No products yet</EmptyMessage.Title>
                    <EmptyMessage.Description>
                      Products added to the Cloudflare catalog will appear here.
                    </EmptyMessage.Description>
                  </EmptyMessage>
                )}
                {!productsLoading && !productsError && products.length > 0 && (
                  <div className="mt-6 overflow-x-auto rounded-xl border border-default">
                    <table className="w-full min-w-[720px] border-collapse text-left">
                      <thead className="text-sm text-secondary">
                        <tr className="border-b border-default">
                          <th scope="col" className="px-4 py-3 font-medium">
                            Product
                          </th>
                          <th scope="col" className="px-4 py-3 font-medium">
                            Category
                          </th>
                          <th scope="col" className="px-4 py-3 font-medium">
                            Sizes
                          </th>
                          <th scope="col" className="px-4 py-3 text-right font-medium">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr
                            key={product.id}
                            className="border-b border-default last:border-b-0"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                                  <Image
                                    src={product.imageUrl}
                                    alt=""
                                    className="h-full w-full object-contain"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate font-medium">{product.name}</p>
                                  <p className="truncate text-sm text-secondary">
                                    {product.slug}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge color="secondary" variant="soft">
                                {product.category}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-secondary">
                              {product.sizes.length > 0
                                ? product.sizes.join(', ')
                                : 'One size'}
                            </td>
                            <td className="px-4 py-3 text-right font-medium">
                              {formatPrice(product.priceMinor, product.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ) : (
              <div className="flex min-h-[60vh] items-center justify-center">
                <EmptyMessage fill="none">
                  <EmptyMessage.Title>
                    {activeSection} is ready for the next step
                  </EmptyMessage.Title>
                  <EmptyMessage.Description>
                    This section will be built when we add its functionality.
                  </EmptyMessage.Description>
                  <EmptyMessage.ActionRow>
                    <Button
                      type="button"
                      color="primary"
                      variant="solid"
                      onClick={() => selectSection('Home')}
                    >
                      Back to Home
                    </Button>
                  </EmptyMessage.ActionRow>
                </EmptyMessage>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
