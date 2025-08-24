import { getCurrentUser } from '@/libs/utils/sessionUtils';

export default async function WhoAmI() {
  const me = await getCurrentUser();
  return (
    <pre style={{ padding: 16 }}>
      {JSON.stringify(me ?? { notLoggedIn: true }, null, 2)}
    </pre>
  );
}
