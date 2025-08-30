'use client';
import { QuestionInDetail } from '@/types/Questions';
import { Card } from 'antd';
import { MarkdownRenderer } from '../MarkdownRenderer';

export default function QuestionDetailClient({
  question,
}: {
  question: QuestionInDetail;
}) {
  return (
    <Card style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* Question content */}
      <section>
        <MarkdownRenderer md={question.content ?? ''} />
      </section>
      {/* Tags */}
      {question.tags && (
        <div style={{ marginTop: 16 }}>
          <b>Tags:</b> {question.tags.join(', ')}
        </div>
      )}
      {/* answer */}
      <section style={{ marginTop: 32 }}>
        <h2>答案</h2>
        <MarkdownRenderer md={question.answer ?? ''} />
      </section>
    </Card>
  );
}
