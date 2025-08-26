import { listBankFavorites } from '@/libs/db_bank_favorites';
import { authSessionInServer } from '@/libs/utils/sessionUtils';
import MyBanksClient from '@/components/MyBanksClient';
import { groupBy } from '@/libs/groupBy';
import { Bank } from '@/types/Banks';

// DAL
// myBanks：Server Component
export default async function MyBanksPage() {
  // Athentication
  try {
    // Authentication & get user id
    const userId = await authSessionInServer();
    // Get banks data from db
    const banks = await listBankFavorites(userId);
    // Group by topic
    const groupedBanks: Record<string, Bank[]> = groupBy(
      banks,
      (b) => b.topic?.trim() || '未命名题库',
    );

    return <MyBanksClient items={groupedBanks} />;
  } catch (err) {
    console.error('[my-banks/page] auth or query failed:', err);
  }
}
