import type { User } from '@supabase/supabase-js'

export function accountFromUser(user: User) {
  const metadataName = user.user_metadata.name
  const name =
    typeof metadataName === 'string' && metadataName.trim()
      ? metadataName.trim()
      : user.email?.split('@')[0] || 'Account'

  return {
    userId: user.id,
    email: user.email ?? '',
    name,
  }
}
