import { createApi } from '@reduxjs/toolkit/query/react'
import { createAuthenticatedBaseQuery } from '../../lib/authenticatedBaseQuery'
import type {
  CheckoutSessionResponse,
  Order,
  OrderDetailResponse,
  OrderListResponse,
} from '../../types/orders'

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: createAuthenticatedBaseQuery('/api'),
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
