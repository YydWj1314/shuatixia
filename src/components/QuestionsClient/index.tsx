'use client';

import React from 'react';
import { useState } from 'react';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { Avatar, List, Space, Row, Col, Card, Button } from 'antd';
import FilterHeader from '../FIlterHeader';
import { QuestionInShowList } from '@/types/Questions';
import { useMemo, useCallback } from 'react';
import { QuestionListItem } from '../QuestionListItem';

export function QuestionShowList({
  questions,
}: {
  questions: QuestionInShowList[];
}) {
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
            renderItem={(q) => <QuestionListItem key={q.id} question={q} />}
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
