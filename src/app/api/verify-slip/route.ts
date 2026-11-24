import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_URL = process.env.SLIP2GO_API_URL || 'https://connect.slip2go.com';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

interface Slip2GoResult {
  code?: string;
  message?: string;
  data?: {
    referenceId?: string;
    transRef?: string;
    dateTime?: string;
    amount?: number;
    receiver?: {
      account?: {
        name?: string;
        proxy?: { type?: string; account?: string } | null;
        bank?: { account?: string | null };
      };
    };
    sender?: { account?: { name?: string } };
  };
}

/** PromptPay account-type codes used by Slip2Go's checkReceiver. */
function receiverType(promptPayId: string): string | null {
  const digits = promptPayId.replace(/\D/g, '');
  if (digits.length === 10) return '02001'; // mobile number
  if (digits.length === 13) return '02003'; // citizen / tax id
  if (digits.length === 15) return '02004'; // e-wallet id
  return null;
}

function fail(code: string, message: string, status = 200) {
  return NextResponse.json({ ok: false, code, message }, { status });
}

export async function POST(request: Request) {
  const secret = process.env.SLIP2GO_SECRET_KEY;
  if (!secret) {
    return fail('not_configured', 'SLIP2GO_SECRET_KEY is not set on the server', 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail('bad_request', 'Expected multipart/form-data', 400);
  }

  const file = form.get('file');
  const amount = Number(form.get('amount'));
  const promptPayId = String(form.get('promptPayId') ?? '');

  if (!(file instanceof File)) return fail('missing_file', 'No slip image uploaded', 400);
  if (!Number.isFinite(amount) || amount <= 0) return fail('missing_amount', 'Order total is missing', 400);
  if (file.size > MAX_IMAGE_BYTES) return fail('file_too_large', 'Slip image is larger than 8 MB', 413);

  // Conditions are built here so the browser cannot weaken them.
  const checkCondition: Record<string, unknown> = { checkDuplicate: true };
  const type = receiverType(promptPayId);
  if (type) {
    checkCondition.checkReceiver = [
      { accountType: type, accountNumber: promptPayId.replace(/\D/g, '') },
    ];
  }
  checkCondition.checkAmount = { type: 'eq', amount: String(amount) };

  const upstream = new FormData();
  upstream.set('file', file, file.name || 'slip.jpg');
  upstream.set('payload', JSON.stringify(checkCondition));

  let payload: Slip2GoResult;
  try {
    const res = await fetch(`${API_URL}/api/verify-slip/qr-image/info`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}` },
      body: upstream,
      signal: AbortSignal.timeout(25000),
    });
    payload = (await res.json()) as Slip2GoResult;
  } catch (err) {
    console.error('Slip2Go request failed:', err);
    return fail('upstream_error', 'Could not reach Slip2Go, try again', 502);
  }

  if (payload.code !== '200000' && payload.code !== '200200') {
    return fail(payload.code ?? 'rejected', payload.message ?? 'Slip was not accepted');
  }

  // Belt and braces: never trust the condition result alone on the amount.
  const slipAmount = Number(payload.data?.amount);
  if (Number.isFinite(slipAmount) && Math.abs(slipAmount - amount) > 0.005) {
    return fail('amount_mismatch', `Slip is ฿${slipAmount} but the order is ฿${amount}`);
  }

  return NextResponse.json({
    ok: true,
    code: payload.code,
    message: payload.message,
    amount: slipAmount,
    transRef: payload.data?.transRef ?? null,
    dateTime: payload.data?.dateTime ?? null,
    receiverName: payload.data?.receiver?.account?.name ?? null,
    senderName: payload.data?.sender?.account?.name ?? null,
  });
}
