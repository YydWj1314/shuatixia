'use client';

import Link from 'next/link';
import { List, Button, Row, Col } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { useQuestionSaved } from '@/app/hooks/useQuestionSaved';
import type { QuestionInShowList } from '@/types/Questions';

export default function MyBankListItem({
  question,
  isEditMode,
}: {
  question: QuestionInShowList;
  isEditMode: boolean;
}) {
  // 在子组件顶层使用 hook（✅ 正确的用法）
  const { isSaved, isLoading, toggleSave } = useQuestionSaved(question.id);

  return (
    <List.Item key={question.id} style={{ paddingBlock: 12 }}>
      <Row align="middle" style={{ width: '100%' }}>
        <Col flex="auto" style={{ minWidth: 0 }}>
          <Link
            href={`/questions/${question.id}`} // TODO
            style={{
              display: 'inline-block',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {question.content}
          </Link>
        </Col>
        <Col flex="auto" style={{ minWidth: 0 }}></Col>
        <Col>
          <Button
            type="text"
            style={{ visibility: isEditMode ? 'visible' : 'hidden' }}
            loading={isLoading}
            disabled={isLoading}
            icon={
              isSaved ? (
                <StarFilled style={{ color: '#faad14' }} />
              ) : (
                <StarOutlined />
              )
            }
            onClick={toggleSave}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </Col>
      </Row>
    </List.Item>
  );
}
