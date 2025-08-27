import { listBankFavorites } from '@/libs/database/db_bank_favorites';
import { authSessionInServer } from '@/libs/utils/sessionUtils';
import MyBanksClient from '@/components/MyBanksClient';
import { groupBy } from '@/libs/utils/groupBy';
import { Bank } from '@/types/Banks';
import { redirect } from 'next/navigation';

// DAL
// myBanks：Server Component
export default async function MyBanksPage() {
  // Athentication

  // Authentication & get user id
  const userId = await authSessionInServer();
  // Auth failed, redirect
  if (!userId) {
    redirect('/login');
  }

  // Get banks data from db
  const banks = await listBankFavorites(userId);
  // Group by topic
  const groupedBanks: Record<string, Bank[]> = groupBy(
    banks,
    (b) => b.topic?.trim() || '未命名题库',
  );

  return <MyBanksClient items={groupedBanks} />;
}
