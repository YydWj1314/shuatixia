// app/api/questions/top-saved/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/libs/utils/supabase/app_router/server';

type AggRow = { question_id: number; count: number };

export async function GET(req: Request) {
  try {
    const sb = await createClient();
    const { searchParams } = new URL(req.url);
    // 支持 ?n=10 或 ?limit=10，做个兜底与上限
    const raw = searchParams.get('n') ?? searchParams.get('limit') ?? '10';
    const limit = Math.max(1, Math.min(100, Number(raw) || 10));

    // 1) 聚合出每个问题被收藏的次数（question_saved 为示例表名）
    const { data: agg, error: aggErr } = (await sb
      .from('question_saved') // ← 你的“题目收藏表”表名；常见结构：id,user_id,question_id,created_at
      .select('question_id, count:count()')

      .order('count', { ascending: false })
      .limit(limit)) as unknown as { data: AggRow[] | null; error: any };

    if (aggErr) {
      console.error('[top-saved] aggregate error:', aggErr);
      return NextResponse.json(
        { ok: false, error: 'Aggregate failed' },
        { status: 500 },
      );
    }

    const ids = (agg ?? []).map((r) => r.question_id);
    if (!ids.length) {
      return NextResponse.json({ ok: true, items: [] }, { status: 200 });
    }

    // 2) 批量取题目详情（questions 为示例表名/视图名）
    const { data: qs, error: qErr } = await sb
      .from('questions') // ← 你的题目表；按需改字段
      .select('id, title, content, tags')
      .in('id', ids);

    if (qErr) {
      console.error('[top-saved] fetch questions error:', qErr);
      return NextResponse.json(
        { ok: false, error: 'Fetch questions failed' },
        { status: 500 },
      );
    }

    // 3) 按收藏数排序并合并详情（.in() 不保证顺序）
    const detailMap = new Map((qs ?? []).map((q) => [q.id, q]));
    const items = (agg ?? []).map((r) => ({
      question_id: r.question_id,
      saved_count: r.count,
      question: detailMap.get(r.question_id) ?? null,
    }));

    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (e) {
    console.error('[top-saved] unexpected:', e);
    return NextResponse.json(
      { ok: false, error: 'Server error' },
      { status: 500 },
    );
  }
}
