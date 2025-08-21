import ExamClient from '@/components/ExamClient';
import { getBankById } from '@/libs/queryBank';
import { getQuestionsByBankId } from '@/libs/queryQuestion';
import { Question } from '@/types/Exam';

type QuestionWithBank = Question & { bank: string };

export default async function Home({ params }: { params: { bankId: string } }) {
  const bankId = Number(params.bankId);
  const questions = await getQuestionsByBankId(bankId);
  const bank = await getBankById(bankId);

  const newQuestions: QuestionWithBank[] = questions.map((item) => ({
    ...item,
    bank: bank?.topic ?? '', // 防空
  }));

  return <ExamClient questions={newQuestions} />;
}
