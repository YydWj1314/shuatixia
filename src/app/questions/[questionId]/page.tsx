// app/questions/[id]/page.tsx
import { notFound } from 'next/navigation';
import { createClient } from '@/libs/utils/supabase/app_router/server';
import type { Metadata } from 'next';
import QuestionDetailClient from '@/components/QuestionDetailCLient';
import { getQuestionByQid } from '@/libs/database/db_questions';

// // // 可选：SEO
// // export async function generateMetadata({
// //   params,
// // }: PageProps): Promise<Metadata> {
// //   return {
// //     title: `题目 ${params.id} - 学习平台`,
// //   };
// }

export default async function QuestionDetailPage({
  params,
}: {
  params: { questionId: string };
}) {
  const questionId = Number(params.questionId); // get  url params

  if (!Number.isFinite(questionId)) {
    return notFound();
  }

  // 从数据库取题目
  const question = await getQuestionByQid(questionId);

  if (!question) {
    return notFound();
  }

  return <QuestionDetailClient question={question} />;
}
