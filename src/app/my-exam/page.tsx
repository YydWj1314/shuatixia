import {
  getQuestionsByBankId,
  getSavedQuestionsByUserId,
} from '@/libs/database/db_questions';
import { authSessionInServer } from '@/libs/utils/sessionUtils';
import { redirect } from 'next/navigation';
import MyExamClient from '@/components/MyExamClient';
export default async function MyQuestionsPage() {
  const userId = await authSessionInServer();
  if (!userId) redirect('/login');

  // 如果函数直接返回数组：
  // const items = await getSavedQuestionsByUserId(userId);

  // 如果函数返回对象：
  const myQuestions = await getSavedQuestionsByUserId(userId);

  return <MyExamClient questions={myQuestions} />;
}
