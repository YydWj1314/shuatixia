// app/dev/db-test/page.tsx   （确保扩展名是 .tsx）
import { pool } from '@/libs/db';

export default async function DbTestPage() {
  try {
    const nowRes = await pool.query('select now() as now');
    const countRes = await pool.query(
      'select count(*)::int as n from public.users',
    );
    return (
      <pre style={{ padding: 16 }}>
        {JSON.stringify(
          { now: nowRes.rows[0].now, users_count: countRes.rows[0].n },
          null,
          2,
        )}
      </pre>
    );
  } catch (e: any) {
    return (
      <pre style={{ whiteSpace: 'pre-wrap', color: 'crimson', padding: 16 }}>
        {e?.message || String(e)}
      </pre>
    );
  }
}
