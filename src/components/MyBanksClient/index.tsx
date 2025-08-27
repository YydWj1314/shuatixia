'use client';
import { List, Row, Col, Switch, Popconfirm, Button, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import BankTopicCard from '../TopicCard/BankTopicCard';
import { Bank } from '@/types/Banks';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

interface BankGroups {
  // groupKey = topic
  [groupKey: string]: Bank[];
}

export default function MyBanksClient({ items }: { items: BankGroups }) {
  // 把 { [groupKey(topic)]: Bank[]...} obj
  //  转成数组 [[topic, banks] ...]，便于 List 渲染
  const bankGroupArr = Object.entries(items);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // console.log('delete item selected', selectedItems);

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

  // callback function --> select one item
  const onToggleOne = useCallback((id: number, checked: boolean) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }, []);

  // // callback function --> select all
  const onToggleAll = useCallback((ids: number[], checked: boolean) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (checked) {
        ids.forEach((id) => next.add(id));
      } else {
        ids.forEach((id) => next.delete(id));
      }
      return next;
    });
  }, []);

  return (
    <>
      {/* Button row */}
      <Row justify="end" gutter={14}>
        {/* delete button */}
        <Col>
          {isEditMode && (
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
          )}
        </Col>
        {/* edit button */}
        <Col
          style={{
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span style={{ marginRight: 8 }}>Edit Mode</span>
          <Switch
            checked={isEditMode}
            onChange={(checked) => setIsEditMode(checked)}
          />
        </Col>
      </Row>

      {/* Content  */}
      <Row justify="center">
        <List
          grid={{ gutter: 36, xs: 1, sm: 1, md: 1, lg: 2 }}
          style={{
            maxWidth: 1188,
            margin: '0 auto',
            paddingInline: 18, // = gutter/2，兜住 .ant-row 的负外边距
          }}
          dataSource={bankGroupArr}
          rowKey={([groupKey]) => groupKey}
          // === Render list ===
          renderItem={([groupKey, banks]) => {
            // TODO 可选：拿第一个有图片的 bank 作为封面
            // const coverSrc = banks.find((b) => b.picture)?.picture ?? null;
            return (
              <List.Item style={{ display: 'flex', justifyContent: 'center' }}>
                <BankTopicCard
                  topic={groupKey}
                  banks={banks}
                  isEditMode={isEditMode}
                  selected={selectedItems} // ✅ 受控
                  onToggleOne={onToggleOne} // ✅ 单个
                  onToggleAll={onToggleAll} // ✅ 全选
                />
              </List.Item>
            );
          }}
        />
      </Row>
    </>
  );
}
