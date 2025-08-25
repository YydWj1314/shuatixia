'use client';

import { Bank } from '@/types/Banks';
import { Card, Typography, Checkbox, Space } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import type { CheckboxProps } from 'antd';

export default function BankTopicCard({
  topic, // groupKey
  banks,
  isEditMode,
}: {
  topic: string;
  banks: Bank[];
  isEditMode: boolean;
}) {
  const [selectedItems, setselectedItems] = useState<Set<number>>(new Set());
  const total = banks.length;
  const selectedCount = selectedItems.size;
  const isAllChecked = total > 0 && selectedCount === total;
  const isIndeterminate = selectedCount > 0 && selectedCount < total;

  // checkbox select one
  function selectOne(id: number) {
    const newSet = new Set(selectedItems);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setselectedItems(newSet);
    return;
  }

  // 顶部全选/全不选
  function selectAll(checked: boolean) {
    if (checked) {
      setselectedItems(new Set(banks.map((b) => b.id)));
    } else {
      setselectedItems(new Set());
    }
  }

  return (
    <Card
      hoverable
      title={topic}
      style={{ width: '100%', minWidth: 360, maxWidth: 480 }}
      extra={
        <Space size={12} align="center">
          {isEditMode && (
            <Checkbox
              indeterminate={isIndeterminate}
              checked={isAllChecked}
              onChange={(e) => selectAll(e.target.checked)}
            >
              Select All
            </Checkbox>
          )}
        </Space>
      }
    >
      {banks.length ? (
        <ul style={{ margin: 0, paddingLeft: 18, listStyle: 'none' }}>
          {banks.map((b) => (
            <li key={b.id} title={b.title}>
              {isEditMode ? (
                <Checkbox
                  onChange={(e) => selectOne(b.id)}
                  checked={selectedItems.has(b.id)}
                >
                  {b.title}
                </Checkbox>
              ) : (
                <Link href={`/exams/${b.id}`}>{b.title || 'No title'}</Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ color: '#999' }}>暂无题目</div>
      )}
    </Card>
  );
}
