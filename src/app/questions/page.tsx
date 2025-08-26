'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Tag,
  Input,
  Segmented,
  Select,
  List,
  Space,
  Badge,
  Pagination,
  Typography,
  Skeleton,
  Empty,
  Divider,
} from 'antd';
import type { SegmentedValue } from 'antd/es/segmented';

const { Content } = Layout;
const { CheckableTag } = Tag;
const { Title, Text } = Typography;

type Question = {
  id: number;
  title: string;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  updated_at?: string;
};

const ALL_TAGS = [
  '数组',
  '字符串',
  '哈希',
  '双指针',
  '栈/队列',
  '链表',
  '二叉树',
  '动态规划',
  '图',
  '数学',
];
const DIFF_OPTIONS: Array<SegmentedValue> = ['All', 'Easy', 'Medium', 'Hard'];
const SORT_OPTIONS = [
  { label: '最近更新', value: 'updated_desc' },
  { label: '最早更新', value: 'updated_asc' },
  { label: '难度从易到难', value: 'diff_asc' },
  { label: '难度从难到易', value: 'diff_desc' },
];

export default function QuestionFilterList() {
  // ————— 筛选条件 —————
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState<SegmentedValue>('All');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<string>('updated_desc');

  // ————— 分页 —————
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // ————— 数据 —————
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<Question[]>([]);

  // 将选中标签转为稳定的查询字符串（避免 Set 作为依赖导致无限请求）
  const selectedTagArray = useMemo(
    () => Array.from(selectedTags),
    [selectedTags],
  );
  const tagQuery = selectedTagArray.join(',');

  // 拉数据（你可以替换为实际接口）
  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          keyword,
          sort,
          // difficulty: String(difficulty),
          tags: tagQuery,
        });
        // 示例：/api/questions?page=1&pageSize=12&keyword=...&difficulty=...&tags=a,b&sort=...
        const res = await fetch(`/api/questions?${params.toString()}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        // 期望返回 { total: number, items: Question[] }
        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
      } catch {
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => controller.abort();
  }, [page, pageSize, keyword, sort, difficulty, tagQuery]);

  // 切换标签
  function toggleTag(tag: string, checked: boolean) {
    setPage(1); // 筛选变化回到第一页
    setSelectedTags((prev) => {
      const next = new Set(prev);
      checked ? next.add(tag) : next.delete(tag);
      return next;
    });
  }

  // 计算列表空态
  const isEmpty = !loading && items.length === 0;

  return (
    <Layout style={{ background: 'transparent' }}>
      <Content
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '24px 16px 40px',
        }}
      >
        {/* 顶部：标题 */}
        <Row style={{ marginBottom: 12 }}>
          <Col span={24}>
            <Title level={3} style={{ margin: 0 }}>
              题目列表
            </Title>
            <Text type="secondary">
              上方筛选 · 下方分页列表 · 支持关键词与排序
            </Text>
          </Col>
        </Row>

        <Card
          size="small"
          style={{ marginBottom: 16 }}
          bodyStyle={{ paddingBottom: 8 }}
          title="筛选条件"
          extra={<Badge count={selectedTags.size} title="已选标签数" />}
        >
          {/* 第一行：标签筛选 */}
          <Row gutter={[8, 8]} align="middle" style={{ marginBottom: 8 }}>
            <Col flex="80px">
              <Text strong>标签：</Text>
            </Col>
            <Col flex="auto">
              <Space size={[8, 8]} wrap>
                {ALL_TAGS.map((tag) => (
                  <CheckableTag
                    key={tag}
                    checked={selectedTags.has(tag)}
                    onChange={(checked) => toggleTag(tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </Space>
            </Col>
          </Row>

          {/* 第二行：难度 / 排序 / 搜索 */}
          <Row gutter={[12, 12]} align="middle" wrap>
            <Col xs={24} md={8}>
              <Space>
                <Text strong>难度：</Text>
                <Segmented
                  size="small"
                  options={DIFF_OPTIONS}
                  value={difficulty}
                  onChange={(v) => {
                    setPage(1);
                    setDifficulty(v);
                  }}
                />
              </Space>
            </Col>

            <Col xs={24} md={8}>
              <Space>
                <Text strong>排序：</Text>
                <Select
                  size="small"
                  style={{ minWidth: 180 }}
                  options={SORT_OPTIONS}
                  value={sort}
                  onChange={(v) => {
                    setPage(1);
                    setSort(v);
                  }}
                />
              </Space>
            </Col>

            <Col xs={24} md={8}>
              <Input.Search
                allowClear
                placeholder="搜索题目标题/关键词"
                onSearch={(val) => {
                  setPage(1);
                  setKeyword(val.trim());
                }}
                enterButton
              />
            </Col>
          </Row>
        </Card>

        <Divider style={{ margin: '12px 0' }} />

        {/* 列表区域 */}
        <Card>
          {loading ? (
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3 }}
              dataSource={Array.from({ length: pageSize })}
              renderItem={(_, idx) => (
                <List.Item key={idx}>
                  <Card>
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </Card>
                </List.Item>
              )}
            />
          ) : isEmpty ? (
            <Empty description="没有符合条件的题目" />
          ) : (
            <>
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3 }}
                dataSource={items}
                renderItem={(q) => (
                  <List.Item key={q.id}>
                    <Card
                      hoverable
                      title={q.title}
                      extra={
                        <Badge
                          color={
                            q.difficulty === 'Easy'
                              ? 'green'
                              : q.difficulty === 'Medium'
                                ? 'orange'
                                : 'red'
                          }
                          text={q.difficulty}
                        />
                      }
                    >
                      <Space size={[6, 6]} wrap>
                        {q.tags?.map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </Space>
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {q.updated_at
                            ? `更新于：${new Date(q.updated_at).toLocaleString()}`
                            : '—'}
                        </Text>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />

              {/* 分页 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 12,
                }}
              >
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  showSizeChanger
                  onChange={(p, ps) => {
                    setPage(p);
                    setPageSize(ps);
                  }}
                  showTotal={(t) => `共 ${t} 道题`}
                />
              </div>
            </>
          )}
        </Card>
      </Content>
    </Layout>
  );
}
