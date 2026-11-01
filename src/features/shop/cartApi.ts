import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '../../lib/supabase'
import type { CartItem } from './shopSlice'

type CartResponse = {
  data: CartItem[]
}

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/cart',
    prepareHeaders: async (headers) => {
      const { data } = (await supabase?.auth.getSession()) ?? {
        data: { session: null },
      }
      const accessToken = data.session?.access_token
      if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
      return headers
    },
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<CartItem[], void>({
      query: () => '',
      transformResponse: (response: CartResponse) => response.data,
      providesTags: ['Cart'],
    }),
    addCartItem: builder.mutation<
      CartItem[],
      Omit<CartItem, 'quantity'> & { quantity: number }
    >({
      query: (item) => ({
        url: '/items',
        method: 'POST',
        body: item,
      }),
      transformResponse: (response: CartResponse) => response.data,
      invalidatesTags: ['Cart'],
    }),
    setCartItemQuantity: builder.mutation<CartItem[], CartItem>({
      query: (item) => ({
        url: '/items',
        method: 'PUT',
        body: item,
      }),
      transformResponse: (response: CartResponse) => response.data,
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation<CartItem[], Omit<CartItem, 'quantity'>>({
      query: ({ slug, size }) => ({
        url: `/items?slug=${encodeURIComponent(slug)}&size=${encodeURIComponent(size)}`,
        method: 'DELETE',
      }),
      transformResponse: (response: CartResponse) => response.data,
      invalidatesTags: ['Cart'],
    }),
  }),
})

export const {
  useAddCartItemMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useSetCartItemQuantityMutation,
} = cartApi
