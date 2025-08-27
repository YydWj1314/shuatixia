import { Button, Space, List } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { useQuestionSaved } from '@/app/hooks/useQuestionSaved';
import { QuestionInShowList } from '@/types/Questions';

export function QuestionListItem({
  question,
}: {
  question: QuestionInShowList;
}) {
  // console.log('[ListItem]: ', question);
  const { isSaved, isLoading, toggleSave } = useQuestionSaved(question.id);

  return (
    <List.Item
      style={{
        paddingBlock: 40,
        position: 'relative',
      }}
    >
      <List.Item.Meta
        title={<a href="">{question.content}</a>}
        description={question.tags}
      />
      [Answer]: {question.answer}
      {/* 右下角按钮 */}
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
