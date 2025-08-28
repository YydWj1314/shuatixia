'use client';

import Link from 'next/link';
import { List, Button, Space, Tag } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { useQuestionSaved } from '@/app/hooks/useQuestionSaved';
import type { QuestionInShowList } from '@/types/Questions';

export default function QuestionListItem({
  question,
}: {
  question: QuestionInShowList;
}) {
  // 在子组件顶层使用 hook（✅ 正确的用法）
  const { isSaved, isLoading, toggleSave } = useQuestionSaved(question.id);

  return (
    <List.Item
      key={question.id}
      style={{ paddingBlock: 40, position: 'relative' }}
    >
      <List.Item.Meta
        // 避免空 href，跳转到题目详情；如果没有详情页，去掉 Link 直接渲染文本即可
        title={
          <Link href={`/questions/${question.id}`}>{question.content}</Link>
        }
        description={
          Array.isArray(question.tags) ? (
            <Space size={4} wrap>
              {question.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </Space>
          ) : (
            question.tags
          )
        }
      />

      {/* 答案区：按需改样式/是否折叠 */}
      <div style={{ marginTop: 12 }}>
        [Answer]: {question.answer ?? '（暂无）'}
      </div>

      {/* 右下角收藏按钮 */}
      <div style={{ position: 'absolute', bottom: 8, right: 16 }}>
        <Space>
          <Button
            type="text"
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
        </Space>
      </div>
    </List.Item>
  );
}
