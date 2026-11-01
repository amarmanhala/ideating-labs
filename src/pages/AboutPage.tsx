import { ButtonLink } from '@openai/apps-sdk-ui/components/Button'
import { ArrowRightSm } from '@openai/apps-sdk-ui/components/Icon'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'

export function AboutPage() {
  return (
    <div className="min-h-screen bg-surface text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-5 py-3 sm:px-8 sm:py-4 lg:px-12">
        <SiteHeader />

        <main className="flex flex-1 items-center py-16 sm:py-24">
          <article className="mx-auto w-full max-w-5xl">
            <h1 className="heading-xl max-w-4xl sm:heading-3xl lg:heading-4xl">
              Ideating Labs began with a familiar feeling: a mind that would
              not switch off.
            </h1>

            <div className="mt-14 grid gap-8 text-lg leading-relaxed sm:mt-20 sm:text-xl lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6">
                <p>
                  Stress, anxiety, and overthinking can make an ordinary day
                  feel crowded. The same thoughts repeat. The next task feels
                  urgent. The present moment gets pushed somewhere behind
                  everything else.
                </p>
                <p>
                  We wanted to place a different thought inside that routine—
                  something quiet, useful, and close enough to notice. So we
                  began putting simple reminders on the things people already
                  wear and carry.
                </p>
              </div>

              <div className="space-y-6">
                <p>
                  “One thing at a time.” “Be here.” “Better days ahead.” These
                  messages do not ask you to become a different person. They
                  create a small pause: a chance to breathe, soften the noise,
                  and return to what is in front of you.
                </p>
                <p>
                  Ideating Labs is not therapy or treatment. It is thoughtful
                  design for busy minds—clothing and objects that can carry a
                  kinder idea into the moments when you may need it most.
                </p>
              </div>
            </div>

            <div className="mt-14 sm:mt-20">
              <p className="heading-lg max-w-3xl sm:heading-xl">
                We cannot remove every difficult thought. We can help make room
                for a gentler one.
              </p>
              <ButtonLink
                to="/shop"
                color="primary"
                size="lg"
                className="mt-8"
              >
                Explore the collection
                <ArrowRightSm />
              </ButtonLink>
            </div>
          </article>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
