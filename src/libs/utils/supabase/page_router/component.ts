import { createBrowserClient } from '@supabase/ssr';

/**
 *  Runs on the client. Reads cookies from browser storage. Behind the scenes
 * @returns
 */
export function createClient() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
  return supabase;
}
