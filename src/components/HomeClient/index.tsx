'use client';
import { List, Card } from 'antd';
import Link from 'next/link';
import { Bank } from '@/types/Banks';

interface BankGroups {
  [groupKey: string]: Bank[];
}

export default function HomeClient({ items }: { items: BankGroups }) {
  // 把 { [groupKey]: Bank[] } 转成数组，便于 List 渲染
  const groups = Object.entries(items); // [ [groupKey, banks], ... ]

  return (
    <List
      grid={{ gutter: 36, xs: 1, sm: 1, md: 1, lg: 2 }}
      style={{
        maxWidth: 1188,
        margin: '0 auto',
        paddingInline: 18, // ✅ = gutter/2，兜住 .ant-row 的负外边距
      }}
      dataSource={groups}
      rowKey={([groupKey]) => groupKey}
      renderItem={([groupKey, banks]) => {
        // TODO 可选：拿第一个有图片的 bank 作为封面
        const coverSrc = banks.find((b) => b.picture)?.picture ?? null;

        return (
          <List.Item style={{ display: 'flex', justifyContent: 'center' }}>
            <Card
              hoverable
              title={groupKey}
              style={{ width: '100%', minWidth: 360, maxWidth: 480 }}
              cover={
                coverSrc ? (
                  //TODO
                  // 如果你用 next/image，这里换成 <Image /> 并配置 next.config.js 的 images.domains
                  <div
                    style={{
                      height: 140,
                      background: `url(${coverSrc}) center/cover`,
                    }}
                  />
                ) : null
              }
            >
              {banks.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {banks.map((b) => (
                    <li key={b.id} title={b.title}>
                      {/* TODO */}
                      <Link href={`/exams/${b.id}`}>
                        {b.title || 'No title'}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#999' }}>暂无题目</div>
              )}
            </Card>
          </List.Item>
        );
      }}
    />
  );
}
