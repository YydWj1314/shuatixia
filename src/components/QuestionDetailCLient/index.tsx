'use client';
import { QuestionInDetail } from '@/types/Questions';
import { Card } from 'antd';

export default function QuestionDetailClient({
  question,
}: {
  question: QuestionInDetail;
}) {
  return (
    <Card
      style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}
      title={question.content}
    >
      {question.tags && (
        <div style={{ marginTop: 16 }}>
          <b>Tags:</b> {question.tags.join(', ')}
        </div>
      )}

      <section style={{ marginTop: 32 }}>
        <h2>答案</h2>
        <div>{question.answer}</div>
      </section>
    </Card>
  );
}
