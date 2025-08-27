'use client';

import React from 'react';
import { useState } from 'react';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { Avatar, List, Space, Row, Col, Card, Button } from 'antd';
import FilterHeader from '../FIlterHeader';
import { QuestionForList } from '@/types/Questions';
import { useMemo, useCallback } from 'react';

export function QuestionShowList({
  questions,
}: {
  questions: QuestionForList[];
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [serachMode, setSearchMode] = useState<'SINGLE' | 'MULTI'>('SINGLE');
  const [selectedTags, setSelectedTags] = useState(new Set<string>());

  // Get tags from question list
  const allUniqueTags = useMemo(
    // userMemo() prevent Repetitive Calculation when redering
    () => [...new Set(questions.flatMap((q) => q.tags ?? []).filter(Boolean))],
    [questions],
  );

  // Call back from header component
  // Use useCallback avoid creating too much variables
  const toggleTagsCallback = useCallback((newSelectedTags: Set<string>) => {
    // 复制一份，确保引用变化（Set 是引用类型）
    setSelectedTags((prev) => {
      // 幂等更新：值没变就不更新
      if (
        prev.size === newSelectedTags.size &&
        [...prev].every((t) => newSelectedTags.has(t))
      )
        return prev;
      return new Set(newSelectedTags);
    });
    setSearchMode(newSelectedTags.size > 1 ? 'MULTI' : 'SINGLE');
  }, []);

  // console.log(selectedTags);

  // Filter questions by selected tags
  const filteredQuesions = useMemo(() => {
    if (selectedTags.size === 0) {
      return questions;
    }
    // return filter questions
    return questions.filter(
      (q) => (q.tags ?? []).some((t) => selectedTags.has(t)), // tags exist in seletctedTags，return
    );
  }, [selectedTags]);

  // TODO
  async function toogleSave(questionId: number) {
    const res = await fetch('api/questions/${questionId}/saved', {
      method: 'POST',
      headers: {
        'Content-Type': '',
      },
      credentials: 'include',
      body: JSON.stringify({ questionId }),
    });

    if (!res.ok) {
    }
  }

  return (
    <>
      {/* Header */}
      <Space direction="vertical" style={{ display: 'flex' }}>
        <FilterHeader allTags={allUniqueTags} onChange={toggleTagsCallback} />
      </Space>

      {/* Content */}
      <Row gutter={12}>
        {/* Right-- question contents*/}
        <Col span={18}>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{ pageSize: 8 }}
            dataSource={filteredQuesions}
            footer={
              <div>
                <b>Click question to search in GPT</b>
              </div>
            }
            renderItem={(q) => (
              <List.Item
                style={{
                  paddingBlock: 40, // 每项上下内边距
                  position: 'relative', // 让子元素能 absolute
                }}
                key={q.id} //
              >
                {/* 内容部分 */}
                <List.Item.Meta
                  title={<a href="">{q.content}</a>}
                  description={q.tags}
                />
                [Answer]: {q.answer}
                {/* 右下角按钮 */}
                <div style={{ position: 'absolute', bottom: 8, right: 16 }}>
                  <Space>
                    <Button
                      type="text"
                      icon={
                        isSaved ? (
                          <StarFilled style={{ color: '#faad14' }} />
                        ) : (
                          <StarOutlined />
                        )
                      }
                      onClick={toogleSave}
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                  </Space>
                </div>
              </List.Item>
            )}
          />
        </Col>

        {/* Left-- side bar*/}
        <Col span={6}>
          <Card>this is left </Card>
        </Col>
      </Row>
    </>
  );
}
