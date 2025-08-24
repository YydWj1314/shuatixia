'use client';

import { useEffect, useState } from 'react';
import { Question } from '@/types/Exam';
import { Layout, Row, Col, Card, Space, Button, Slider, Badge } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import type { CSSProperties } from 'react';
import { useParams } from 'next/navigation';
import './index.css';
import { useBankFavorites } from '@/app/hooks/useBankFavorites';

const { Header, Content } = Layout;

type BtnType = 'primary' | 'default';
type BtnProps = { type: BtnType; danger: boolean; style?: CSSProperties };

// 统一计算按钮样式，解决颜色覆盖：当前(蓝) > 标记(红) > 已答(绿) > 默认(灰)
function getBtnProps(opts: {
  isCurrent: boolean;
  isMarked: boolean;
  isDone: boolean;
}): BtnProps {
  const { isCurrent, isMarked, isDone } = opts;

  const doneStyle: CSSProperties = {
    backgroundColor: '#52c41a', // 经典绿色
    color: '#fff',
    borderColor: '#52c41a',
  };

  if (isCurrent) return { type: 'primary', danger: false };
  if (isMarked) return { type: 'default', danger: true };
  if (isDone) return { type: 'default', danger: false, style: doneStyle };
  return { type: 'default', danger: false };
}

export default function ExamClient({ questions }: { questions: Question[] }) {
  const qn = questions.length;

  const [qi, setQi] = useState(0); // 当前题 index
  const [isAnswerHidden, setIsAnswerHidden] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [marks, setMarks] = useState<Set<number>>(new Set());
  const [answered, setAnswered] = useState<Set<number>>(new Set());

  // from router: exams/[bankId]
  const params = useParams(); // to get path parameters
  const bankId = Number(params.bankId);

  // swr hooks
  const { isFavorited, isLoading, isValidating, toggleFavorite } =
    useBankFavorites(bankId);

  // 切题时自动隐藏答案
  useEffect(() => {
    setIsAnswerHidden(true);
  }, [qi]);

  const curr = questions[qi];

  const toggleMark = () => {
    const id = Number(curr.id);
    setMarks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // mark answer when click mark button
  const markAnswered = () => {
    const id = Number(curr.id);
    setAnswered((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部 */}
      <Header style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
        <Row
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Col style={{ fontWeight: 700 }}>{curr.bank}</Col>

          <Col>
            <Button
              className="content-button-favorite  "
              icon={<StarOutlined />}
              type={isFavorited ? 'primary' : 'default'}
              onClick={toggleFavorite}
            >
              {isFavorited ? 'unFavorite' : 'Favorite'}
            </Button>
          </Col>
        </Row>
      </Header>

      {/* 内容区 */}
      <Content>
        <div className="content-wrapper">
          <Row gutter={24}>
            {/* 左侧：题目 + 答案 */}
            <Col xs={24} md={16}>
              <Card className="content-main-card">
                <Col className="content-question" style={{ fontSize }}>
                  {curr.content}
                </Col>

                <Row className="content-show-answer">
                  <Button
                    style={{ width: 300 }}
                    className={[
                      'content-button-answer',
                      isAnswerHidden && 'content-button-answer--show',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      setIsAnswerHidden(false);
                      markAnswered(); // 点击显示答案即标记为“answered”
                    }}
                  >
                    👉 Show Answer
                  </Button>
                </Row>

                <Row className="content-bottom">
                  <Col>
                    <Button
                      disabled={qi <= 0}
                      className="content-button-previous"
                      onClick={() => setQi((prev) => Math.max(prev - 1, 0))}
                    >
                      Previous
                    </Button>
                  </Col>

                  <Row>
                    <Button
                      disabled={qi >= qn - 1}
                      className="content-button-next"
                      onClick={() =>
                        setQi((prev) => Math.min(prev + 1, qn - 1))
                      }
                    >
                      Next {qi}
                    </Button>
                  </Row>
                  <Row>
                    <Button
                      className="content-button-mark"
                      onClick={toggleMark}
                    >
                      {marks.has(Number(curr.id)) ? 'Unmark' : 'Mark'}
                    </Button>
                  </Row>
                </Row>

                {/* 答案 */}
                <Row
                  className={`content-answer ${isAnswerHidden ? 'is-hidden' : ''}`}
                >
                  <Col className="content-answer__text" style={{ fontSize }}>
                    {curr.answer}
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* 右侧：答题卡 + 设置 */}
            <Col xs={24} md={8}>
              <Card
                title="Records"
                extra={<Badge status="success" text="Done" />}
                style={{ marginBottom: 16 }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: 8,
                  }}
                >
                  {questions.map((q, index) => {
                    const props = getBtnProps({
                      isCurrent: index === qi,
                      isMarked: marks.has(Number(q.id)),
                      isDone: answered.has(Number(q.id)),
                    });

                    return (
                      <Button
                        key={q.id}
                        size="small"
                        {...props}
                        onClick={() => setQi(index)}
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </div>
              </Card>

              <Card title="设置">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>选后自动下一题</span>
                  </div>
                  <div>
                    <div style={{ marginBottom: 8 }}>字号</div>
                    <Slider
                      min={14}
                      max={20}
                      value={fontSize}
                      onChange={setFontSize}
                    />
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}
