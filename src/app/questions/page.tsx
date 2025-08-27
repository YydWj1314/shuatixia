import MyBanksClient from '@/components/MyBanksClient';
import { QuestionShowList } from '@/components/QuestionsClient';
import { Question } from '@/types/Exams';
import { authSessionInServer } from '@/libs/utils/sessionUtils';
import { redirect } from 'next/navigation';
import { getAllQuestions } from '@/libs/database/db_questions';
import { QuestionInShowList } from '@/types/Questions';

export default async function QuestionsPage() {
  // Authentication & get user id
  const userId = await authSessionInServer();
  // Auth failed, redirect
  if (!userId) {
    // 可带 return url，登录后跳回
    redirect('/login');
  }

  // Request
  const questions: QuestionInShowList[] = await getAllQuestions();
  // console.log(questions);
  return <QuestionShowList questions={questions} />;
}
