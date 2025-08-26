'use client';
import { List, Row, Col, Switch } from 'antd';
import BankTopicCard from '../TopicCard/BankTopicCard';
import { Bank } from '@/types/Banks';
import { useState } from 'react';

interface BankGroups {
  // groupKey = topic
  [groupKey: string]: Bank[];
}

export default function MyBanksClient({ items }: { items: BankGroups }) {
  // 把 { [groupKey(topic)]: Bank[]...} obj
  //  转成数组 [[topic, banks] ...]，便于 List 渲染
  const bankGroupArr = Object.entries(items);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <>
      {/* Button row */}
      <Row justify="end">
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
                <BankTopicCard // card component
                  topic={groupKey}
                  banks={banks}
                  isEditMode={isEditMode}
                />
              </List.Item>
            );
          }}
        />
      </Row>
    </>
  );
}
