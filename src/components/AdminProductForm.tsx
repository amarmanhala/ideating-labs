import { Alert } from '@openai/apps-sdk-ui/components/Alert'
import { Button } from '@openai/apps-sdk-ui/components/Button'
import { ArrowLeft, Check, Plus } from '@openai/apps-sdk-ui/components/Icon'
import { Input } from '@openai/apps-sdk-ui/components/Input'
import { Select, type Option } from '@openai/apps-sdk-ui/components/Select'
import { Textarea } from '@openai/apps-sdk-ui/components/Textarea'
import { useState, type FormEvent } from 'react'
import { useCreateProductMutation } from '../features/catalog/catalogApi'
import {
  productCategories,
  type ProductCategory,
} from '../types/catalog'

const categoryOptions: Option<ProductCategory>[] = productCategories.map(
  (category) => ({ value: category, label: category }),
)

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'error' in error.data &&
    typeof error.data.error === 'object' &&
    error.data.error !== null &&
    'message' in error.data.error &&
    typeof error.data.error.message === 'string'
  ) {
    return error.data.error.message
  }

  return 'The product could not be created. Please try again.'
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function AdminProductForm({ onCancel }: { onCancel: () => void }) {
  const [createProduct, { isLoading }] = useCreateProductMutation()
  const [adminKey, setAdminKey] = useState('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [category, setCategory] = useState<ProductCategory>('Tops')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [sizes, setSizes] = useState('')
  const [description, setDescription] = useState('')
  const [materials, setMaterials] = useState('')
  const [fit, setFit] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [createdProduct, setCreatedProduct] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setCreatedProduct('')

    const priceNumber = Number(price)
    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      setErrorMessage('Enter a valid product price.')
      return
    }

    try {
      const product = await createProduct({
        adminKey,
        name: name.trim(),
        slug: slug.trim(),
        category,
        priceMinor: Math.round(priceNumber * 100),
        currency: 'CAD',
        imageUrl: imageUrl.trim(),
        sizes: sizes
          .split(',')
          .map((size) => size.trim())
          .filter(Boolean),
        description: description.trim(),
        materials: materials.trim(),
        fit: fit.trim(),
      }).unwrap()
      setCreatedProduct(product.name)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <section className="mt-10" aria-labelledby="add-product-heading">
      <div className="flex items-start gap-3">
        <Button
          type="button"
          color="secondary"
          variant="ghost"
          uniform
          aria-label="Back to products"
          onClick={onCancel}
        >
          <ArrowLeft />
        </Button>
        <div>
          <h2 id="add-product-heading" className="heading-lg">
            Add product
          </h2>
          <p className="mt-1 text-sm text-secondary">
            Create a new product in the Cloudflare catalog.
          </p>
        </div>
      </div>

      <form className="mt-8 max-w-3xl space-y-8" onSubmit={handleSubmit}>
        {errorMessage && (
          <Alert
            color="danger"
            variant="soft"
            title="Product not created"
            description={errorMessage}
          />
        )}
        {createdProduct && (
          <Alert
            color="success"
            variant="soft"
            indicator={<Check />}
            title="Product created"
            description={`${createdProduct} is now available in the catalog.`}
            actions={
              <Button
                type="button"
                color="secondary"
                variant="outline"
                onClick={onCancel}
              >
                View products
              </Button>
            }
          />
        )}

        <div className="space-y-3">
          <h3 className="font-semibold">Admin access</h3>
          <label className="block space-y-2">
            <span className="text-sm font-medium">Admin key</span>
            <Input
              type="password"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Enter the configured Cloudflare admin key"
              size="xl"
              required
              autoComplete="off"
            />
            <span className="block text-sm text-secondary">
              Used only for this request and never stored in the product database.
            </span>
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-2 sm:col-span-2">
            <span className="text-sm font-medium">Product name</span>
            <Input
              value={name}
              onChange={(event) => {
                const nextName = event.target.value
                setName(nextName)
                if (!slugEdited) setSlug(createSlug(nextName))
              }}
              placeholder="BREATHE TEE"
              size="xl"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Slug</span>
            <Input
              value={slug}
              onChange={(event) => {
                setSlugEdited(true)
                setSlug(createSlug(event.target.value))
              }}
              placeholder="breathe-tee"
              size="xl"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Category</span>
            <Select
              value={category}
              options={categoryOptions}
              onChange={(option) => setCategory(option.value)}
              size="xl"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Price (CAD)</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="42.00"
              size="xl"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Sizes</span>
            <Input
              value={sizes}
              onChange={(event) => setSizes(event.target.value)}
              placeholder="XS, S, M, L, XL, XXL"
              size="xl"
            />
            <span className="block text-sm text-secondary">
              Separate multiple sizes with commas. Leave empty for one-size items.
            </span>
          </label>

          <label className="block space-y-2 sm:col-span-2">
            <span className="text-sm font-medium">Image URL or path</span>
            <Input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="/images/products/product-name.png"
              size="xl"
              required
            />
          </label>

          <label className="block space-y-2 sm:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              size="xl"
              required
            />
          </label>

          <label className="block space-y-2 sm:col-span-2">
            <span className="text-sm font-medium">Materials and care</span>
            <Textarea
              value={materials}
              onChange={(event) => setMaterials(event.target.value)}
              rows={3}
              size="xl"
              required
            />
          </label>

          <label className="block space-y-2 sm:col-span-2">
            <span className="text-sm font-medium">Size and fit</span>
            <Textarea
              value={fit}
              onChange={(event) => setFit(event.target.value)}
              rows={3}
              size="xl"
              required
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            color="primary"
            variant="solid"
            size="lg"
            loading={isLoading}
          >
            <Plus />
            Add product
          </Button>
          <Button
            type="button"
            color="secondary"
            variant="outline"
            size="lg"
            disabled={isLoading}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </section>
  )
}
