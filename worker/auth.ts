export type AuthenticatedUser = {
  id: string
  email: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function requireUser(
  request: Request,
  env: Env,
): Promise<AuthenticatedUser | null> {
  const authorization = request.headers.get('Authorization')
  const accessToken = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : ''

  if (!accessToken) return null
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('Supabase authentication bindings are not configured.')
  }

  let userUrl: URL
  try {
    userUrl = new URL('/auth/v1/user', env.SUPABASE_URL)
  } catch {
    throw new Error('The Supabase URL binding is invalid.')
  }

  const response = await fetch(userUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: env.SUPABASE_PUBLISHABLE_KEY,
    },
  })
  if (!response.ok) {
    console.warn(
      JSON.stringify({
        message: 'Supabase user verification failed',
        status: response.status,
      }),
    )
    return null
  }

  const user: unknown = await response.json()
  if (
    !isRecord(user) ||
    typeof user.id !== 'string' ||
    !user.id ||
    typeof user.email !== 'string' ||
    !user.email
  ) {
    return null
  }

  return { id: user.id, email: user.email }
}
