import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'

const sections = [
  ['about', 'About these terms'],
  ['eligibility', 'Eligibility'],
  ['products', 'Products and availability'],
  ['orders', 'Orders and payment'],
  ['shipping', 'Shipping and delivery'],
  ['returns', 'Returns and refunds'],
  ['uploads', 'Your uploads'],
  ['wellness', 'Wellness disclaimer'],
  ['acceptable-use', 'Acceptable use'],
  ['intellectual-property', 'Intellectual property'],
  ['third-parties', 'Third-party services'],
  ['disclaimers', 'Disclaimers'],
  ['liability', 'Limitation of liability'],
  ['changes', 'Changes to these terms'],
  ['general', 'General terms'],
] as const

export function TermsPage() {
  return (
    <div className="min-h-screen bg-surface text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-5 py-3 sm:px-8 sm:py-4 lg:px-12">
        <SiteHeader />

        <main className="flex-1 pb-24 pt-16 sm:pt-24">
          <div className="border-b border-subtle pb-12 sm:pb-16">
            <p className="text-sm text-secondary">Published: October 28, 2026</p>
            <h1 className="mt-5 max-w-5xl text-5xl tracking-tight sm:text-7xl lg:text-8xl">
              Terms of Use
            </h1>
            <p className="mt-6 text-base text-secondary">
              Effective October 28, 2026
            </p>
          </div>

          <div className="grid gap-12 pt-12 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-between lg:gap-20 lg:pt-16">
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <p className="mb-4 text-xs uppercase text-secondary">On this page</p>
              <nav aria-label="Terms sections" className="flex flex-col items-start gap-3 text-sm">
                {sections.map(([id, title]) => (
                  <TextLink key={id} to={`#${id}`} underline={false}>
                    {title}
                  </TextLink>
                ))}
              </nav>
            </aside>

            <article className="space-y-14 text-base leading-relaxed sm:text-lg">
              <section id="about" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">About these terms</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    Thank you for visiting Ideating Labs. These Terms of Use
                    govern your access to our website, online store, product
                    pages, file-upload features, and related services
                    (collectively, the “Services”). By using the Services or
                    placing an order, you agree to these Terms.
                  </p>
                  <p>
                    “Ideating Labs,” “we,” “us,” and “our” refer to the operator
                    of the Services. “You” means the person using the Services
                    or purchasing our products. If you do not agree to these
                    Terms, please do not use the Services.
                  </p>
                </div>
              </section>

              <section id="eligibility" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Eligibility</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    You must be legally capable of entering into a binding
                    agreement where you live. If you are under the age of
                    majority, a parent or legal guardian must approve your use
                    of the Services and any purchase you make.
                  </p>
                  <p>
                    You agree to provide accurate contact, billing, delivery,
                    and order information and to keep that information current.
                  </p>
                </div>
              </section>

              <section id="products" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Products and availability</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    We create apparel and everyday objects carrying mindful,
                    grounding messages. Product colors, proportions, textures,
                    and placement may appear differently across screens and may
                    vary slightly between production runs.
                  </p>
                  <p>
                    All products are subject to availability. We may limit
                    quantities, discontinue products, correct descriptions, or
                    update prices before accepting an order.
                  </p>
                </div>
              </section>

              <section id="orders" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Orders and payment</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    Your order is an offer to purchase. An order confirmation
                    acknowledges receipt but does not guarantee acceptance. We
                    may decline or cancel an order for reasons including stock
                    errors, pricing mistakes, payment issues, suspected fraud,
                    or legal restrictions. If we cancel after charging you, we
                    will issue an appropriate refund.
                  </p>
                  <p>
                    Prices are shown in the currency presented at checkout.
                    Applicable taxes, duties, shipping charges, and other fees
                    will be shown before you submit your order where required.
                    You authorize us and our payment providers to charge the
                    selected payment method for the final amount.
                  </p>
                </div>
              </section>

              <section id="shipping" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Shipping and delivery</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    Delivery dates are estimates, not guarantees. Timing can be
                    affected by production, carrier operations, customs,
                    weather, and circumstances outside our reasonable control.
                    You are responsible for providing a complete and accurate
                    delivery address.
                  </p>
                  <p>
                    International orders may be subject to import duties,
                    taxes, or brokerage charges imposed by the destination.
                    Unless checkout states otherwise, those charges are the
                    recipient’s responsibility.
                  </p>
                </div>
              </section>

              <section id="returns" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Returns and refunds</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    Return eligibility, timing, item condition, and refund
                    methods are described in the return information presented
                    with your purchase. Personalized, made-to-order, worn,
                    washed, damaged, or final-sale items may be ineligible for
                    return except where consumer law requires otherwise.
                  </p>
                  <p>
                    These Terms do not limit any mandatory cancellation,
                    refund, warranty, or other consumer rights that apply where
                    you live.
                  </p>
                </div>
              </section>

              <section id="uploads" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Your uploads</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    Some products may let you upload artwork, images, text, or
                    other files for reference or personalization (“Uploads”).
                    You retain ownership of your Uploads. You grant us a
                    limited, worldwide license to host, reproduce, modify, and
                    use them only as reasonably necessary to review, produce,
                    fulfill, support, and document your order.
                  </p>
                  <p>
                    You represent that you own or have permission to use every
                    Upload and that it does not violate privacy, publicity,
                    intellectual-property, or other rights. Do not upload
                    unlawful, hateful, exploitative, misleading, or harmful
                    material. We may reject an Upload or cancel a related order
                    when reasonably necessary.
                  </p>
                </div>
              </section>

              <section id="wellness" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Wellness disclaimer</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    Our products use encouraging language about presence,
                    worry, rest, and overthinking. They are creative lifestyle
                    products—not medical devices, therapy, diagnosis,
                    treatment, crisis support, or a substitute for advice from
                    a qualified health professional.
                  </p>
                  <p>
                    If you are concerned about your mental health or safety,
                    seek support from an appropriate professional or local
                    emergency resource. A message printed on a product cannot
                    promise or produce a particular health outcome.
                  </p>
                </div>
              </section>

              <section id="acceptable-use" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Acceptable use</h2>
                <div className="mt-6 space-y-5">
                  <p>You may not use the Services to:</p>
                  <ul className="list-disc space-y-3 pl-6">
                    <li>break the law or violate another person’s rights;</li>
                    <li>submit fraudulent orders or payment information;</li>
                    <li>upload malicious code or interfere with security;</li>
                    <li>scrape, overload, or disrupt the Services;</li>
                    <li>impersonate another person or misrepresent affiliation; or</li>
                    <li>resell or commercially exploit the Services without permission.</li>
                  </ul>
                </div>
              </section>

              <section id="intellectual-property" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Intellectual property</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    The Services and their branding, product designs, copy,
                    graphics, photographs, software, and other materials are
                    owned by Ideating Labs or its licensors and are protected
                    by intellectual-property laws. These Terms do not transfer
                    ownership of those materials to you.
                  </p>
                  <p>
                    You may use purchased products for personal, lawful
                    purposes. You may not reproduce our artwork, manufacture
                    derivative merchandise, or use our marks commercially
                    without written permission.
                  </p>
                </div>
              </section>

              <section id="third-parties" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Third-party services</h2>
                <p className="mt-6">
                  We may rely on third parties for payments, delivery,
                  analytics, file hosting, and other functionality. Their
                  services may be governed by separate terms and privacy
                  policies. We are not responsible for third-party services
                  outside our control, except where applicable law provides
                  otherwise.
                </p>
              </section>

              <section id="disclaimers" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Disclaimers</h2>
                <p className="mt-6">
                  To the maximum extent permitted by law, the Services are
                  provided on an “as available” basis. We do not promise that
                  the Services will always be uninterrupted, secure, or error
                  free. Statutory warranties and consumer guarantees that
                  cannot lawfully be excluded remain in effect.
                </p>
              </section>

              <section id="liability" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Limitation of liability</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    To the maximum extent permitted by law, Ideating Labs will
                    not be liable for indirect, incidental, special,
                    consequential, or punitive damages arising from the
                    Services or products.
                  </p>
                  <p>
                    Where liability may lawfully be limited, our aggregate
                    liability relating to a product or order will not exceed
                    the amount you paid for that product or order. This section
                    does not exclude liability that cannot legally be excluded.
                  </p>
                </div>
              </section>

              <section id="changes" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Changes to these terms</h2>
                <p className="mt-6">
                  We may update these Terms to reflect changes in our products,
                  Services, practices, or legal obligations. The updated
                  version will state its effective date. When changes are
                  material, we will provide notice where reasonably required.
                  Your continued use after the effective date means the updated
                  Terms apply to your future use.
                </p>
              </section>

              <section id="general" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">General terms</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    If any provision is found unenforceable, the remaining
                    provisions will continue in effect. A delay in enforcing a
                    provision is not a waiver. You may not transfer your rights
                    under these Terms without our permission; we may transfer
                    ours as part of a reorganization, financing, sale, or
                    transfer of the Services.
                  </p>
                  <p>
                    These Terms, together with policies and information
                    presented during checkout, form the agreement between you
                    and Ideating Labs concerning the Services and your orders.
                    Questions may be submitted through the support channel made
                    available on the Site.
                  </p>
                </div>
              </section>
            </article>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
