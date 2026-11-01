import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  CreateProductInput,
  Product,
  ProductCategory,
  ProductDetailResponse,
  ProductListResponse,
} from '../../types/catalog'

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], ProductCategory | undefined>({
      query: (category) => ({
        url: '/products',
        params: category ? { category } : undefined,
      }),
      transformResponse: (response: ProductListResponse) => response.data,
      providesTags: ['Products'],
    }),
    getProduct: builder.query<Product, string>({
      query: (slug) => `/products/${encodeURIComponent(slug)}`,
      transformResponse: (response: ProductDetailResponse) => response.data,
    }),
    createProduct: builder.mutation<
      Product,
      CreateProductInput & { adminKey: string }
    >({
      query: ({ adminKey, ...product }) => ({
        url: '/admin/products',
        method: 'POST',
        headers: { Authorization: `Bearer ${adminKey}` },
        body: product,
      }),
      transformResponse: (response: ProductDetailResponse) => response.data,
      invalidatesTags: ['Products'],
    }),
  }),
})

export const {
  useCreateProductMutation,
  useGetProductQuery,
  useGetProductsQuery,
} = catalogApi
