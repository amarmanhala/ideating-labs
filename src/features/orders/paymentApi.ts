import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '../../lib/supabase'
import type {
  CheckoutSessionResponse,
  Order,
  OrderDetailResponse,
  OrderListResponse,
} from '../../types/orders'

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: async (headers) => {
      const { data } = (await supabase?.auth.getSession()) ?? {
        data: { session: null },
      }
      const accessToken = data.session?.access_token
      if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
      return headers
    },
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<string, { checkoutKey: string }>({
      query: (body) => ({
        url: '/checkout/session',
        method: 'POST',
        body,
      }),
      transformResponse: (response: CheckoutSessionResponse) => response.data.url,
    }),
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      transformResponse: (response: OrderListResponse) => response.data,
      providesTags: ['Orders'],
    }),
    getOrder: builder.query<Order, string>({
      query: (orderId) => `/orders/${encodeURIComponent(orderId)}`,
      transformResponse: (response: OrderDetailResponse) => response.data,
      providesTags: (_result, _error, orderId) => [
        { type: 'Orders', id: orderId },
      ],
    }),
  }),
})

export const {
  useCreateCheckoutSessionMutation,
  useGetOrderQuery,
  useGetOrdersQuery,
} = paymentApi
