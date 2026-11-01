import { Button } from '@openai/apps-sdk-ui/components/Button'
import { Checkbox } from '@openai/apps-sdk-ui/components/Checkbox'
import { TextLink } from '@openai/apps-sdk-ui/components/TextLink'
import { useCallback, useEffect, useRef, useState } from 'react'

type CookiePreferencesState = {
  analytics: boolean
  marketingMeasurement: boolean
  personalizedMarketing: boolean
}

const storageKey = 'ideating-labs-cookie-preferences'

const defaultPreferences: CookiePreferencesState = {
  analytics: false,
  marketingMeasurement: false,
  personalizedMarketing: false,
}

function readPreferences() {
  try {
    const saved = window.localStorage.getItem(storageKey)
    return saved
      ? { ...defaultPreferences, ...JSON.parse(saved) }
      : defaultPreferences
  } catch {
    return defaultPreferences
  }
}

export function CookiePreferences() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [preferences, setPreferences] = useState<CookiePreferencesState>(
    defaultPreferences,
  )

  const openDialog = useCallback(() => {
    setPreferences(readPreferences())
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  }, [])

  const closeDialog = useCallback(() => {
    dialogRef.current?.close()
    if (window.location.hash === '#manage-cookies') {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`,
      )
    }
  }, [])

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === '#manage-cookies') {
        openDialog()
      }
    }

    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [openDialog])

  const handleOpen = () => {
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#manage-cookies`,
    )
    openDialog()
  }

  const handleSave = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(preferences))
    } catch {
      // Preferences still apply for the current session when storage is unavailable.
    }

    window.dispatchEvent(
      new CustomEvent('ideatinglabs:cookie-preferences', {
        detail: { necessary: true, ...preferences },
      }),
    )
    closeDialog()
  }

  return (
    <>
      <Button
        type="button"
        color="secondary"
        variant="ghost"
        size="2xs"
        opticallyAlign="start"
        className="text-xs"
        onClick={handleOpen}
      >
        Manage cookies
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="cookie-preferences-title"
        className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl bg-surface p-0 text-primary shadow-2xl backdrop:bg-black/40"
        onCancel={closeDialog}
      >
        <div className="p-6 sm:p-7">
          <h2 id="cookie-preferences-title" className="heading-lg">
            Cookie preferences
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-secondary">
            We use cookies and similar technologies to operate the store,
            understand how it performs, and improve your experience. Choose
            which optional cookies we may use. You can change these choices at
            any time.{' '}
            <TextLink to="/privacy#cookies">Learn more</TextLink>
          </p>

          <div className="mt-7 space-y-6">
            <div>
              <Checkbox checked disabled label="Strictly necessary" />
              <p className="ml-7 mt-1 text-sm leading-relaxed text-secondary">
                Required for essential features such as security, cart storage,
                checkout, and saving your cookie choices. These cannot be
                turned off.
              </p>
            </div>

            <div>
              <Checkbox
                checked={preferences.analytics}
                label="Analytics cookies"
                onCheckedChange={(analytics) =>
                  setPreferences((current) => ({ ...current, analytics }))
                }
              />
              <p className="ml-7 mt-1 text-sm leading-relaxed text-secondary">
                Help us understand visits, popular products, and how the store
                performs so we can improve it.
              </p>
            </div>

            <div>
              <Checkbox
                checked={preferences.marketingMeasurement}
                label="Marketing measurement"
                onCheckedChange={(marketingMeasurement) =>
                  setPreferences((current) => ({
                    ...current,
                    marketingMeasurement,
                  }))
                }
              />
              <p className="ml-7 mt-1 text-sm leading-relaxed text-secondary">
                Help us measure whether our campaigns and product launches are
                effective.
              </p>
            </div>

            <div>
              <Checkbox
                checked={preferences.personalizedMarketing}
                label="Personalized marketing"
                onCheckedChange={(personalizedMarketing) =>
                  setPreferences((current) => ({
                    ...current,
                    personalizedMarketing,
                  }))
                }
              />
              <p className="ml-7 mt-1 text-sm leading-relaxed text-secondary">
                Allow us to tailor Ideating Labs promotions on other websites
                based on your interactions with our store.
              </p>
            </div>
          </div>

          <Button
            type="button"
            color="primary"
            size="lg"
            block
            className="mt-8"
            onClick={handleSave}
          >
            Save preferences
          </Button>
        </div>
      </dialog>
    </>
  )
}
