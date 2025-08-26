import ExamClient from '@/components/ExamClient';
import { getBankById } from '@/libs/db_question_banks';
import { getQuestionsByBankId } from '@/libs/db_questions';
import { Question } from '@/types/Exam';

type QuestionWithBank = Question & { bank: string };

export default async function Home({ params }: { params: { bankId: string } }) {
  const bankId = Number(params.bankId);
  const questions = await getQuestionsByBankId(bankId);
  const bank = await getBankById(bankId);

  // 为每一个 question添加bank 标签
  const newQuestions: QuestionWithBank[] = questions.map((item) => ({
    ...item,
    bank: bank?.title ?? '', // 防空
  }));

  return <ExamClient questions={newQuestions} />;
}
