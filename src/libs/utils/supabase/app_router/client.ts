import { createBrowserClient } from '@supabase/ssr';

/**
 * To access Supabase from Client Components, which run in the browser.
 * @returns
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
