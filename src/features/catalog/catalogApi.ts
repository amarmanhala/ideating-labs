import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  Product,
  ProductCategory,
  ProductDetailResponse,
  ProductListResponse,
} from '../../types/catalog'

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], ProductCategory | undefined>({
      query: (category) => ({
        url: '/products',
        params: category ? { category } : undefined,
      }),
      transformResponse: (response: ProductListResponse) => response.data,
    }),
    getProduct: builder.query<Product, string>({
      query: (slug) => `/products/${encodeURIComponent(slug)}`,
      transformResponse: (response: ProductDetailResponse) => response.data,
    }),
  }),
})

export const { useGetProductQuery, useGetProductsQuery } = catalogApi
