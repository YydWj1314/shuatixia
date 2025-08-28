// app/questions/[id]/page.tsx
import { notFound } from 'next/navigation';
import { createClient } from '@/libs/utils/supabase/app_router/server';
import type { Metadata } from 'next';

type PageProps = {
  params: { id: string };
};

// 可选：SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: `题目 ${params.id} - 学习平台`,
  };
}

export default async function QuestionPage({ params }: PageProps) {
  const sb = await createClient();
  const questionId = Number(params.id);

  if (!Number.isFinite(questionId)) {
    return notFound();
  }

  // 从数据库取题目
  const { data: question, error } = await sb
    .from('questions')
    .select('id, title, content, answer, tags')
    .eq('id', questionId)
    .maybeSingle();

  if (error || !question) {
    return notFound();
  }

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>{question.title ?? `题目 #${question.id}`}</h1>
      <p style={{ marginTop: 16 }}>{question.content}</p>

      {question.tags && (
        <div style={{ marginTop: 16 }}>
          <b>Tags:</b> {question.tags.join(', ')}
        </div>
      )}

      <section style={{ marginTop: 32 }}>
        <h2>答案</h2>
        <div>{question.answer}</div>
      </section>
    </main>
  );
}
