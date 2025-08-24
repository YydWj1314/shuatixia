import { createClient as createClientPrimitive } from '@supabase/supabase-js';

/**
 * Runs at build time, where there is no user, session, or cookies
 * @returns
 */
export function createClient() {
  const supabase = createClientPrimitive(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  return supabase;
}
