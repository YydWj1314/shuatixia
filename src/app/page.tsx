import HomeClient from '@/components/HomeClient';
import { getAllBanks } from '../libs/queryBank';
import { groupBy } from '../libs/groupBy';
import { Bank } from '@/types/Banks';

export default async function Home() {
  const banks = await getAllBanks(99);

  // Group by topic
  const bankGroupedByTopic: Record<string, Bank[]> = groupBy(
    banks,
    (b) => b.topic?.trim() || '未命名题库',
  );

  return <HomeClient items={bankGroupedByTopic} />;
}
