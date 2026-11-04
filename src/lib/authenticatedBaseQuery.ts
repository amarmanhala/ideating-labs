import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { supabase } from './supabase'

let refreshPromise: Promise<boolean> | null = null

async function refreshSession() {
  if (!supabase) return false

  refreshPromise ??= supabase.auth
    .refreshSession()
    .then(({ data, error }) => !error && Boolean(data.session?.access_token))
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

export function createAuthenticatedBaseQuery(
  baseUrl: string,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      const { data } = (await supabase?.auth.getSession()) ?? {
        data: { session: null },
      }
      const accessToken = data.session?.access_token
      if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
      return headers
    },
  })

  return async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions)
    if (result.error?.status !== 401 || !supabase) return result

    if (!(await refreshSession())) {
      await supabase.auth.signOut({ scope: 'local' })
      return result
    }

    const retry = await baseQuery(args, api, extraOptions)
    if (retry.error?.status === 401) {
      await supabase.auth.signOut({ scope: 'local' })
    }
    return retry
  }
}
