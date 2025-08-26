'use client';

import { Bank } from '@/types/Banks';
import { Button, Card, Checkbox, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BankTopicCard({
  topic, // groupKey
  banks,
  isEditMode,
}: {
  topic: string;
  banks: Bank[];
  isEditMode: boolean;
}) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const total = banks.length;
  const selectedCount = selectedItems.size;
  const isAllChecked = total > 0 && selectedCount === total;
  const isIndeterminate = selectedCount > 0 && selectedCount < total;
  const router = useRouter();

  // Checkbox select one
  function selectOne(id: number) {
    const newSet = new Set(selectedItems);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedItems(newSet);
    return;
  }

  // Checkbox select all
  function selectAll(targetIsChecked: boolean) {
    if (targetIsChecked) {
      setSelectedItems(new Set(banks.map((b) => b.id)));
    } else {
      setSelectedItems(new Set());
    }
  }

  // Click Delete button
  async function toggleDelete(selectedItems: Set<number>) {
    // Check items set is not none
    if (selectedItems.size === 0) {
      message.error('Please select items!');
      return;
    }
    // send request
    const res = await fetch('/api/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankIds: Array.from(selectedItems) }), // set -> array -> JSON
    });
    if (!res.ok) {
      message.error('Delete failed');
      throw new Error('Operation Failed');
    }
    // Get response
    const data = await res.json(); //  { ok: true, count: ... }
    setSelectedItems(new Set());
    router.refresh(); // refresh page
    message.success('Delete successfully');
    return data;
  }

  return (
    <Card
      hoverable
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {topic}
          </span>
        </div>
      }
      style={{ width: '100%', minWidth: 360, maxWidth: 560 }}
      styles={{
        header: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          minHeight: 48,
          paddingInline: 16,
        },
      }}
      extra={
        isEditMode ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Checkbox
              className="small-checkbox"
              indeterminate={isIndeterminate}
              checked={isAllChecked}
              onChange={(e) => selectAll(e.target.checked)}
            >
              <span className="small-checkbox__label">All</span>
            </Checkbox>

            <Popconfirm
              title="Delete selected banks?"
              description="Inrecoverable operation"
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true, size: 'small' }}
              cancelButtonProps={{ size: 'small' }}
              onConfirm={() => toggleDelete(selectedItems)}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </div>
        ) : null
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
