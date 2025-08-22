import { getCurrentUser } from '@/libs/session';

export default async function WhoAmI() {
  const me = await getCurrentUser();
  return (
    <pre style={{ padding: 16 }}>
      {JSON.stringify(me ?? { notLoggedIn: true }, null, 2)}
    </pre>
  );
}
