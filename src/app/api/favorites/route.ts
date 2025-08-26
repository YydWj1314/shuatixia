import { NextResponse } from 'next/server';
import { batchDeleteBankFavorites } from '@/libs/db_bank_favorites';
import { authSessionInServer } from '@/libs/utils/sessionUtils';
import { logCall } from "@/libs/utils/logUtils";

export async function DELETE(req: Request) {
  logCall();
  // Authentication and get userId
  try {
    const userId = await authSessionInServer();

    // Auth failed response
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: 'Not logged in' },
        { status: 401 },
      );
    }
    // Get bankIds from post body
    const { bankIds } = await req.json();
    // delte by bankId[] and userId
    const affected = await batchDeleteBankFavorites(userId, bankIds);
    // Successful response
    return NextResponse.json({ ok: true, affected });
  } catch (e: any) {
    console.error(e);
    const msg = e?.message ?? 'Unknown error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
