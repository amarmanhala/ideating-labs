import { Button } from '@openai/apps-sdk-ui/components/Button'
import { Minus, Plus } from '@openai/apps-sdk-ui/components/Icon'
import { useState, type CSSProperties } from 'react'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'

type FaqItem = {
  question: string
  answer: string
}

type FaqGroup = {
  title: string
  items: FaqItem[]
}

const faqGroups: FaqGroup[] = [
  {
    title: 'Customer service',
    items: [
      {
        question: 'Can I return or exchange my order?',
        answer:
          'Return eligibility and timing are shown with your purchase. Eligible items must be unworn, unwashed, and returned in their original condition. Personalized, made-to-order, and final-sale pieces may not be returnable unless they arrive damaged, defective, or incorrect. Your mandatory consumer rights always apply.',
      },
      {
        question: 'What should I do if my order arrives damaged or incorrect?',
        answer:
          'Contact us through the support channel on the site and include your order number, a short description, and clear photos of the item and packaging. Once reviewed, we will arrange an appropriate replacement, refund, or other resolution based on availability.',
      },
      {
        question: 'Are shipping fees, duties, and taxes refundable?',
        answer:
          'Original shipping charges, customs duties, import taxes, and brokerage fees are generally non-refundable unless the charge resulted from our error or applicable law requires otherwise.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept the credit, debit, and digital payment methods displayed at checkout. Available methods may vary by country, currency, device, and payment provider.',
      },
    ],
  },
  {
    title: 'Orders',
    items: [
      {
        question: 'How do pre-orders work?',
        answer:
          'A pre-order reserves an item that is still being produced. The estimated shipping window will appear on the product page and during checkout. If an order contains both available and pre-order pieces, they may ship together when every item is ready.',
      },
      {
        question: 'Can I change or cancel an order after placing it?',
        answer:
          'Contact support as soon as possible. We will try to help, but changes and cancellations cannot be guaranteed once payment, personalization, production, or fulfillment has started.',
      },
      {
        question: 'Can I order multiple sizes or quantities?',
        answer:
          'Yes, unless a product page shows an item-specific limit. We may limit quantities for small releases so more people have an opportunity to purchase them.',
      },
      {
        question: 'When will I receive my order confirmation?',
        answer:
          'A confirmation should arrive shortly after checkout. Check your spam or promotions folder first. If it is still missing, contact support with the name and email address used for the order.',
      },
    ],
  },
  {
    title: 'Shipping',
    items: [
      {
        question: 'How much does shipping cost?',
        answer:
          'Shipping is calculated at checkout using the destination, package size, and available carrier service. The complete shipping cost is shown before you place the order.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'International availability is shown during checkout. Some destinations may be unavailable because of carrier coverage, customs requirements, or local restrictions.',
      },
      {
        question: 'Will I be charged customs duties or import taxes?',
        answer:
          'International orders may be subject to duties, taxes, or brokerage charges set by the destination country. Unless checkout says otherwise, the recipient is responsible for those charges.',
      },
      {
        question: 'When will my order ship?',
        answer:
          'In-stock items are prepared as quickly as possible. Product pages and order confirmations will show any special production or pre-order timelines. Delivery estimates begin after the carrier receives the package.',
      },
      {
        question: 'When will I receive tracking information?',
        answer:
          'When tracking is available, we will send it after the parcel has been handed to the carrier. It can take a short time for the first tracking scan to appear.',
      },
      {
        question: 'Can I change my shipping address?',
        answer:
          'Address changes may be possible before fulfillment begins. Contact support immediately with your order number and the complete corrected address. We cannot guarantee rerouting after shipment.',
      },
    ],
  },
  {
    title: 'Products & fit',
    items: [
      {
        question: 'How do I choose the right size?',
        answer:
          'Use the size and fit information on each product page and compare it with a similar piece you already own. Fit can vary by garment, so check the product-specific guidance rather than relying only on your usual size.',
      },
      {
        question: 'Will the product look exactly like it does online?',
        answer:
          'We aim to represent every piece accurately. Screen settings, lighting, materials, and small production differences can affect color, texture, proportions, and print placement.',
      },
      {
        question: 'How should I care for my item?',
        answer:
          'Follow the care label attached to the product and the Materials & Care information on its detail page. Gentle washing and avoiding unnecessary high heat will usually help garments and prints last longer.',
      },
    ],
  },
  {
    title: 'Personalization',
    items: [
      {
        question: 'What can I upload for a personalized product?',
        answer:
          'Upload only artwork, images, text, or reference files that you own or have permission to use. Do not include sensitive personal information or content that violates another person’s privacy, intellectual-property, or other rights.',
      },
      {
        question: 'Which file types work best?',
        answer:
          'High-resolution images and print-ready PDF files usually produce the strongest results. The product page will show the accepted formats. Clear files with sufficient contrast and no unintended background are easiest to reproduce.',
      },
      {
        question: 'Will you review my file before production?',
        answer:
          'We may review uploads for basic production suitability and policy compliance, but you remain responsible for spelling, image quality, layout, and permission to use the content you submit.',
      },
    ],
  },
  {
    title: 'Mindful messages',
    items: [
      {
        question: 'What is the idea behind Ideating Labs?',
        answer:
          'We turn simple grounding thoughts into things you can wear and carry. The messages are small interruptions for busy minds—reminders to pause, breathe, and return to what is here now.',
      },
      {
        question: 'Are the products a form of mental-health treatment?',
        answer:
          'No. Ideating Labs products are creative lifestyle goods, not medical devices, therapy, diagnosis, treatment, or crisis support. They do not promise a health outcome and are not a substitute for help from a qualified professional.',
      },
    ],
  },
  {
    title: 'Privacy & support',
    items: [
      {
        question: 'How do you use my information?',
        answer:
          'We use personal information to operate the store, process payments, produce and deliver orders, provide support, prevent fraud, and improve the experience. Read our Privacy Policy for full details and use Manage cookies in the footer to control optional cookies.',
      },
      {
        question: 'Still need help?',
        answer:
          'Contact us through the support channel available on the site. Include your order number when your question is about a purchase so we can assist you more quickly.',
      },
    ],
  },
]

const disclosureButtonStyle = {
  '--button-background-color': 'transparent',
  '--button-background-color-active': 'transparent',
  '--button-text-color-hover': 'var(--color-text-primary)',
} as CSSProperties

export function FaqPage() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-surface font-sans text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-5 py-3 sm:px-8 sm:py-4 lg:px-12">
        <SiteHeader />

        <main className="flex-1 pb-24 pt-16 sm:pt-24">
          <h1 className="sr-only">Frequently asked questions</h1>

          <div className="space-y-16 sm:space-y-20">
            {faqGroups.map((group, groupIndex) => (
              <section
                key={group.title}
                aria-labelledby={`faq-group-${groupIndex}`}
                className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16"
              >
                <h2
                  id={`faq-group-${groupIndex}`}
                  className="text-sm uppercase"
                >
                  {group.title}
                </h2>

                <div className="min-w-0 border-t border-default">
                  {group.items.map((item, itemIndex) => {
                    const itemId = `${groupIndex}-${itemIndex}`
                    const isOpen = openItem === itemId

                    return (
                      <div key={item.question} className="border-b border-default py-2">
                        <h3>
                          <Button
                            type="button"
                            color="secondary"
                            variant="ghost"
                            size="xl"
                            pill={false}
                            block
                            aria-expanded={isOpen}
                            aria-controls={`faq-panel-${itemId}`}
                            className="h-auto min-h-12 whitespace-normal py-3 text-left font-sans leading-relaxed [&>span]:w-full [&>span]:min-w-0 [&>span]:justify-between [&>span]:gap-4"
                            style={disclosureButtonStyle}
                            onClick={() =>
                              setOpenItem((current) =>
                                current === itemId ? null : itemId,
                              )
                            }
                          >
                            <span className="min-w-0 flex-1 wrap-anywhere">{item.question}</span>
                            {isOpen ? (
                              <Minus className="size-5 shrink-0" />
                            ) : (
                              <Plus className="size-5 shrink-0" />
                            )}
                          </Button>
                        </h3>

                        {isOpen && (
                          <p
                            id={`faq-panel-${itemId}`}
                            className="max-w-4xl wrap-anywhere px-4 pb-6 pt-2 text-base leading-relaxed text-secondary sm:text-lg"
                          >
                            {item.answer}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
