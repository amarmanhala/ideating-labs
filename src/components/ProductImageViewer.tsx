import { Button } from '@openai/apps-sdk-ui/components/Button'
import { CloseBold } from '@openai/apps-sdk-ui/components/Icon'
import { useCallback, useEffect, useRef, useState } from 'react'

type Point = { x: number; y: number }
type View = Point & { scale: number }
const initialView: View = { x: 0, y: 0, scale: 1 }

export function ProductImageViewer({ src, alt, onClose }: {
  src: string
  alt: string
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const pointers = useRef(new Map<number, Point>())
  const tapStart = useRef<(Point & { time: number }) | null>(null)
  const lastTap = useRef<(Point & { time: number }) | null>(null)
  const viewRef = useRef(initialView)
  const [view, setView] = useState(initialView)

  const updateView = useCallback((next: View) => {
    const viewport = viewportRef.current
    const image = imageRef.current
    if (!viewport || !image) return
    const scale = Math.min(4, Math.max(1, next.scale))
    const fit = Math.min(
      viewport.clientWidth / (image.naturalWidth || viewport.clientWidth),
      viewport.clientHeight / (image.naturalHeight || viewport.clientHeight),
    )
    const limitX = Math.max(0, ((image.naturalWidth || viewport.clientWidth) * fit * scale - viewport.clientWidth) / 2)
    const limitY = Math.max(0, ((image.naturalHeight || viewport.clientHeight) * fit * scale - viewport.clientHeight) / 2)
    const bounded = {
      scale,
      x: Math.max(-limitX, Math.min(limitX, next.x)),
      y: Math.max(-limitY, Math.min(limitY, next.y)),
    }
    viewRef.current = bounded
    setView(bounded)
  }, [])

  const zoomAt = useCallback((scale: number, point?: Point) => {
    const current = viewRef.current
    const nextScale = Math.min(4, Math.max(1, scale))
    const bounds = viewportRef.current?.getBoundingClientRect()
    const anchor = point && bounds
      ? { x: point.x - bounds.left - bounds.width / 2, y: point.y - bounds.top - bounds.height / 2 }
      : { x: 0, y: 0 }
    const ratio = nextScale / current.scale
    updateView({
      scale: nextScale,
      x: anchor.x - (anchor.x - current.x) * ratio,
      y: anchor.y - (anchor.y - current.y) * ratio,
    })
  }, [updateView])

  useEffect(() => {
    const dialog = dialogRef.current
    const viewport = viewportRef.current
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    const wheel = (event: WheelEvent) => {
      event.preventDefault()
      zoomAt(viewRef.current.scale * Math.exp(-event.deltaY * 0.002), { x: event.clientX, y: event.clientY })
    }
    const resize = () => updateView(initialView)
    viewport?.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('resize', resize)
    return () => {
      viewport?.removeEventListener('wheel', wheel)
      window.removeEventListener('resize', resize)
      dialog?.close()
      document.body.style.overflow = previousOverflow
      opener?.focus()
    }
  }, [zoomAt, updateView])

  return (
    <dialog
      ref={dialogRef}
      aria-label={`${alt} — enlarged image`}
      aria-describedby="product-image-viewer-help"
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-surface p-0 text-primary backdrop:bg-surface"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          event.preventDefault()
          dialogRef.current?.querySelector('button')?.focus()
        } else if (event.key === '+' || event.key === '=') {
          event.preventDefault()
          zoomAt(viewRef.current.scale * 1.25)
        } else if (event.key === '-') {
          event.preventDefault()
          zoomAt(viewRef.current.scale / 1.25)
        } else if (event.key === '0') {
          updateView(initialView)
        }
      }}
    >
      <p id="product-image-viewer-help" className="sr-only">
        Pinch or use the mouse wheel to zoom. Drag to move the enlarged image.
        Double-tap or double-click to zoom in or reset. Keyboard: plus and minus to zoom, zero to reset, Escape to close.
      </p>
      <div
        ref={viewportRef}
        className={`absolute inset-0 touch-none select-none overflow-hidden ${view.scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          event.currentTarget.setPointerCapture(event.pointerId)
          pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
          tapStart.current = pointers.current.size === 1
            ? { x: event.clientX, y: event.clientY, time: Date.now() }
            : null
          if (pointers.current.size > 1) lastTap.current = null
        }}
        onPointerMove={(event) => {
          const previous = pointers.current.get(event.pointerId)
          if (!previous) return
          const before = [...pointers.current.values()]
          pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
          const after = [...pointers.current.values()]
          if (after.length === 2) {
            const distance = (points: Point[]) => Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
            const oldDistance = distance(before)
            if (oldDistance < 1) return
            const middle = (points: Point[]) => ({ x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 })
            const oldMiddle = middle(before)
            const newMiddle = middle(after)
            updateView({ ...viewRef.current, x: viewRef.current.x + newMiddle.x - oldMiddle.x, y: viewRef.current.y + newMiddle.y - oldMiddle.y })
            zoomAt(viewRef.current.scale * distance(after) / oldDistance, newMiddle)
          } else if (after.length === 1 && viewRef.current.scale > 1) {
            updateView({ ...viewRef.current, x: viewRef.current.x + event.clientX - previous.x, y: viewRef.current.y + event.clientY - previous.y })
          }
          if (tapStart.current && Math.hypot(event.clientX - tapStart.current.x, event.clientY - tapStart.current.y) > 10) {
            tapStart.current = null
          }
        }}
        onPointerUp={(event) => {
          pointers.current.delete(event.pointerId)
          const start = tapStart.current
          if (start && Date.now() - start.time < 300) {
            const previousTap = lastTap.current
            if (previousTap && Date.now() - previousTap.time < 350 && Math.hypot(event.clientX - previousTap.x, event.clientY - previousTap.y) < 30) {
              zoomAt(viewRef.current.scale > 1 ? 1 : 2, { x: event.clientX, y: event.clientY })
              lastTap.current = null
            } else {
              lastTap.current = { x: event.clientX, y: event.clientY, time: Date.now() }
            }
          }
          tapStart.current = null
        }}
        onPointerCancel={(event) => {
          pointers.current.delete(event.pointerId)
          tapStart.current = null
          lastTap.current = null
        }}
        onLostPointerCapture={(event) => pointers.current.delete(event.pointerId)}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          draggable={false}
          className="pointer-events-none h-full w-full object-contain"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
        />
      </div>
      <Button
        type="button"
        color="secondary"
        variant="outline"
        size="3xl"
        uniform
        aria-label="Close image viewer"
        className="absolute right-3 top-3 z-10 bg-surface sm:right-6 sm:top-6"
        onClick={onClose}
      >
        <CloseBold aria-hidden="true" />
      </Button>
    </dialog>
  )
}
