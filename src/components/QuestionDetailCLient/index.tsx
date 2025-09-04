'use client';
import { Card } from 'antd';

export default function QuestionDetailClient({
  content,
  answer,
  tags = [],
}: {
  content: React.ReactNode;
  answer: React.ReactNode;
  tags?: string[];
}) {
  return (
    <>
      <Card style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <section>{content}</section>
        {tags.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <b>Tags:</b> {tags.join(', ')}
          </div>
        )}
      </Card>
      <Card style={{ maxWidth: 800, margin: '24px auto 0', padding: 24 }}>
        <section>
          <h2>答案</h2>
          {answer}
        </section>
      </Card>
    </>
  );
}
