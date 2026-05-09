import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// تعریف کلاینت
const client = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'سلام، اگر پیام من را می‌بینی بگو سلام بهرام!' }],
    });

    const content = response.choices[0].message.content;

    // برگرداندن پاسخ به مرورگر
    return NextResponse.json({ success: true, message: content });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error details:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
