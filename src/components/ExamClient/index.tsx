'use client';

import { useEffect, useState } from 'react';
import { Question } from '@/types/Exams';
import {
  Layout,
  Row,
  Col,
  Card,
  Space,
  Button,
  Slider,
  Badge,
  Divider,
  Flex,
} from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import type { CSSProperties } from 'react';
import { useParams } from 'next/navigation';
import './index.css';
import { useBankFavorites } from '@/app/hooks/useBankFavorites';

const { Header, Content } = Layout;

type BtnType = 'primary' | 'default';
type BtnProps = { type: BtnType; danger: boolean; style?: CSSProperties };

// 状态与单一事实源（SOT）
// 统一计算按钮样式，解决颜色覆盖：当前(蓝) > 标记(红) > 已答(绿) > 默认(灰)
function getBtnProps(opts: {
  isCurrent: boolean;
  isMarked: boolean;
  isDone: boolean;
}): BtnProps {
  const { isCurrent, isMarked, isDone } = opts;

  const doneStyle: CSSProperties = {
    backgroundColor: '#52c41a',
    color: '#fff',
    borderColor: '#52c41a',
  };

  if (isCurrent) return { type: 'primary', danger: false };
  if (isMarked) return { type: 'default', danger: true };
  if (isDone) return { type: 'default', danger: false, style: doneStyle };
  return { type: 'default', danger: false };
}

function ToggleSave() {} //TODO}

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

  // Customed swr hooks
  const { isFavorited, isLoading, isValidating, toggleFavorite } =
    useBankFavorites(bankId);

  // hide anwer when switch question
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
      <Header
        style={{
          background: '#fff',
          padding: '0 20px',
          borderBottom: '1px solid #eee',
        }}
      >
        <Row
          style={{
            maxWidth: 1400,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            width: '100%',
          }}
        >
          <Col style={{ fontSize: 18, fontWeight: 600 }}>{curr.bank}</Col>

          <Col>
            <Button
              className="content-button-favorite  "
              icon={<StarOutlined />}
              type={isFavorited ? 'primary' : 'default'}
              onClick={toggleFavorite}
            >
              {isFavorited ? 'Unfavorite' : 'Favorite'}
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
                <Row
                  className="content-question"
                  style={{
                    width: '100%',
                    alignContent: 'start',
                    fontSize,
                  }}
                >
                  {curr.content}
                </Row>

                <Row className="content-show-answer">
                  <Button
                    className={[
                      'content-button-answer',
                      isAnswerHidden && 'content-button-answer--show',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    type="primary"
                    onClick={() => {
                      setIsAnswerHidden(false);
                      markAnswered(); // 点击显示答案即标记为“answered”
                    }}
                  >
                    👉 Show Answer
                  </Button>
                </Row>

                <Row className="content-buttons">
                  <Col
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Space>
                      <Button
                        disabled={qi <= 0}
                        className="content-button-previous"
                        onClick={() => setQi((prev) => Math.max(prev - 1, 0))}
                      >
                        Previous
                      </Button>
                      <Button
                        disabled={qi >= qn - 1}
                        className="content-button-next"
                        onClick={() =>
                          setQi((prev) => Math.min(prev + 1, qn - 1))
                        }
                      >
                        Next
                      </Button>
                      <Button
                        className="content-button-mark"
                        type={
                          marks.has(Number(curr.id)) ? 'primary' : 'default'
                        }
                        onClick={toggleMark}
                      >
                        {marks.has(Number(curr.id)) ? 'Unmark ' : 'Mark'}
                      </Button>
                    </Space>
                    <Space>
                      <Button
                        type="text"
                        size="small"
                        // icon={isSaved ? <StarFilled /> : <StarOutlined />}
                        icon={<StarOutlined />}
                        onClick={ToggleSave}
                      >
                        Save Question
                      </Button>
                    </Space>
                  </Col>

                  <Row></Row>
                </Row>

                {/* 答案 */}
                <Row
                  className={`content-answer ${isAnswerHidden ? 'is-hidden' : ''}`}
                  justify="start" // 横向靠左
                  align="middle" // 垂直居中
                  style={{ fontSize }}
                >
                  <div className="content-answer-text">{curr.answer}</div>
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

              <Card title="Settings">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  ></div>
                  <div>
                    <div style={{ marginBottom: 8 }}>Font size</div>
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
