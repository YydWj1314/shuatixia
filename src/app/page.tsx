import HomeClient from '@/components/HomeClient';
import { getAllBanks } from '../libs/queryBank';
import { groupBy } from '../libs/groupBy';
import { Bank } from '@/types/Banks';

export default async function Home() {
  const banks = await getAllBanks(99);

  // 按 topic 分组（规范化：去空格 + 小写；空用“未命名题库”）
  const bankGroupedByTopic: Record<string, Bank[]> = groupBy(
    banks,
    (b) => b.topic?.trim() || '未命名题库',
  );

  // 注意：这是 Server 组件，console.log 输出在 Server 端终端，不在浏览器控制台
  console.log(bankGroupedByTopic);

  return <HomeClient items={bankGroupedByTopic} />;
}
