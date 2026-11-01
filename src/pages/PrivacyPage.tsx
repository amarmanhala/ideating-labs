import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'

const sections = [
  ['scope', 'About this policy'],
  ['collection', 'Information we collect'],
  ['use', 'How we use information'],
  ['sharing', 'How we share information'],
  ['payments', 'Payments'],
  ['uploads', 'Files you upload'],
  ['cookies', 'Cookies and analytics'],
  ['retention', 'Data retention'],
  ['choices', 'Your choices and rights'],
  ['transfers', 'International processing'],
  ['children', 'Children'],
  ['security', 'Security'],
  ['changes', 'Changes to this policy'],
  ['contact', 'Contact us'],
] as const

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-5 py-3 sm:px-8 sm:py-4 lg:px-12">
        <SiteHeader />

        <main className="flex-1 pb-24 pt-16 sm:pt-24">
          <div className="border-b border-subtle pb-12 sm:pb-16">
            <p className="text-sm text-secondary">Published: October 28, 2026</p>
            <h1 className="mt-5 max-w-5xl text-5xl tracking-tight sm:text-7xl lg:text-8xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-base text-secondary">
              Effective October 28, 2026
            </p>
          </div>

          <div className="grid gap-12 pt-12 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-between lg:gap-20 lg:pt-16">
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <p className="mb-4 text-xs uppercase text-secondary">On this page</p>
              <nav aria-label="Privacy policy sections" className="flex flex-col items-start gap-3 text-sm">
                {sections.map(([id, title]) => (
                  <TextLink key={id} to={`#${id}`} underline={false}>
                    {title}
                  </TextLink>
                ))}
              </nav>
            </aside>

            <article className="space-y-14 text-base leading-relaxed sm:text-lg">
              <section id="scope" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">About this policy</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    Ideating Labs creates apparel and everyday objects carrying
                    mindful messages. This Privacy Policy explains how we
                    collect, use, disclose, and protect personal information
                    when you visit our website, browse the store, place an
                    order, upload a file, or contact us (collectively, the
                    “Services”).
                  </p>
                  <p>
                    “Ideating Labs,” “we,” “us,” and “our” refer to the operator
                    of the Services. This policy does not govern third-party
                    websites or services that have their own privacy policies.
                  </p>
                </div>
              </section>

              <section id="collection" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Information we collect</h2>
                <div className="mt-6 space-y-5">
                  <p>We collect information in three main ways:</p>
                  <ul className="list-disc space-y-3 pl-6">
                    <li>
                      <strong>Information you provide,</strong> such as your
                      name, email address, phone number, billing and delivery
                      details, order notes, support messages, and files or text
                      you submit for a personalized product.
                    </li>
                    <li>
                      <strong>Order information,</strong> such as products,
                      sizes, quantities, prices, discounts, returns, refunds,
                      and transaction history.
                    </li>
                    <li>
                      <strong>Information collected automatically,</strong>
                      such as IP address, device and browser type, pages viewed,
                      referring page, approximate location derived from your IP
                      address, and interactions with the Services.
                    </li>
                  </ul>
                  <p>
                    If you choose not to provide information needed for an
                    order, we may be unable to process or deliver it.
                  </p>
                </div>
              </section>

              <section id="use" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">How we use information</h2>
                <div className="mt-6 space-y-5">
                  <p>We use personal information to:</p>
                  <ul className="list-disc space-y-3 pl-6">
                    <li>operate the store and provide requested features;</li>
                    <li>process payments, fulfill orders, and manage returns;</li>
                    <li>produce personalized products using your instructions;</li>
                    <li>send order, delivery, service, and policy updates;</li>
                    <li>answer questions and provide customer support;</li>
                    <li>understand and improve our products and website;</li>
                    <li>detect fraud, abuse, and security incidents; and</li>
                    <li>comply with tax, accounting, and other legal obligations.</li>
                  </ul>
                  <p>
                    We may use aggregated or de-identified information for
                    analytics and product planning where it no longer
                    reasonably identifies an individual.
                  </p>
                </div>
              </section>

              <section id="sharing" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">How we share information</h2>
                <div className="mt-6 space-y-5">
                  <p>We may disclose personal information to:</p>
                  <ul className="list-disc space-y-3 pl-6">
                    <li>
                      providers that support payments, hosting, analytics,
                      customer service, production, printing, warehousing,
                      fraud prevention, email, and delivery;
                    </li>
                    <li>
                      professional advisers, insurers, regulators, courts, or
                      authorities when reasonably necessary or legally required;
                    </li>
                    <li>
                      a buyer, successor, or adviser involved in a merger,
                      financing, reorganization, or sale of all or part of our
                      business; and
                    </li>
                    <li>
                      another party when you direct us to share information or
                      give us permission.
                    </li>
                  </ul>
                  <p>
                    We do not sell personal information for money. Service
                    providers may process information only for the services
                    they perform for us, subject to their agreements and
                    applicable law.
                  </p>
                </div>
              </section>

              <section id="payments" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Payments</h2>
                <p className="mt-6">
                  Payments are processed by third-party payment providers. We
                  generally receive transaction details, such as payment status,
                  amount, and a limited payment-method reference, rather than
                  complete card or bank-account credentials. Payment providers
                  handle information under their own privacy notices and legal
                  obligations.
                </p>
              </section>

              <section id="uploads" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Files you upload</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    If a product lets you upload artwork, images, text, or other
                    reference files, we use those files to review your request,
                    create the product, fulfill the order, and provide support.
                    Production partners may receive the file and order details
                    necessary to perform that work.
                  </p>
                  <p>
                    Please do not upload sensitive personal information that is
                    not needed for your order. You are responsible for having
                    permission to provide personal information about anyone
                    shown or identified in an upload.
                  </p>
                </div>
              </section>

              <section id="cookies" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Cookies and analytics</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    We and our service providers may use cookies, local storage,
                    pixels, and similar technologies to keep the store working,
                    remember preferences and cart contents, understand website
                    performance, prevent fraud, and measure visits.
                  </p>
                  <p>
                    You can control many of these technologies through your
                    browser or device settings. Blocking required storage may
                    affect cart, checkout, or other site functions.
                  </p>
                </div>
              </section>

              <section id="retention" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Data retention</h2>
                <p className="mt-6">
                  We keep personal information only as long as reasonably
                  necessary for the purposes described in this policy. The
                  period depends on the type of information and may include time
                  needed to fulfill orders, maintain tax and transaction
                  records, resolve disputes, prevent fraud, enforce agreements,
                  and meet legal requirements. When information is no longer
                  needed, we delete, anonymize, or securely isolate it as
                  appropriate.
                </p>
              </section>

              <section id="choices" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Your choices and rights</h2>
                <div className="mt-6 space-y-5">
                  <p>
                    Depending on where you live, you may have rights to access,
                    correct, delete, or receive a copy of personal information;
                    withdraw consent; object to or restrict certain processing;
                    and complain to a privacy regulator.
                  </p>
                  <p>
                    You may unsubscribe from marketing email using the link in
                    the message. Essential order and service communications will
                    still be sent when needed. To make another privacy request,
                    contact us through the support channel on our website. We
                    may need to verify your identity before completing a request.
                  </p>
                </div>
              </section>

              <section id="transfers" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">International processing</h2>
                <p className="mt-6">
                  Ideating Labs and its providers may process information in
                  countries other than the one where you live. Privacy laws may
                  differ between countries. Where required, we use appropriate
                  contractual or other safeguards for international transfers.
                </p>
              </section>

              <section id="children" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Children</h2>
                <p className="mt-6">
                  The Services are not directed to children under 13, and we do
                  not knowingly collect their personal information. A person
                  below the age of majority where they live should use the
                  Services and make purchases only with permission from a parent
                  or legal guardian. Contact us if you believe a child has
                  provided personal information without appropriate permission.
                </p>
              </section>

              <section id="security" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Security</h2>
                <p className="mt-6">
                  We use reasonable administrative, technical, and
                  organizational measures designed to protect personal
                  information. No website, storage system, or transmission is
                  completely secure, so we cannot guarantee absolute security.
                </p>
              </section>

              <section id="changes" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Changes to this policy</h2>
                <p className="mt-6">
                  We may update this Privacy Policy as our products, practices,
                  or legal obligations change. We will post the updated version
                  with a new effective date and provide additional notice when
                  required by law.
                </p>
              </section>

              <section id="contact" className="scroll-mt-8">
                <h2 className="text-3xl tracking-tight sm:text-4xl">Contact us</h2>
                <p className="mt-6">
                  If you have a privacy question, concern, or request, contact
                  Ideating Labs through the support channel provided on our
                  website. Please describe your request and the country or
                  region where you live so we can respond appropriately.
                </p>
              </section>
            </article>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
