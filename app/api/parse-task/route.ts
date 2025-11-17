import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ParseRequestSchema = z.object({
  input: z.string().min(1, "Input cannot be empty").max(500),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = ParseRequestSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  const { input } = result.data;

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a task parser. Extract structured task information from natural language input.
Always respond with valid JSON only, no markdown, no explanation.
Today's date is ${new Date().toISOString().split('T')[0]}.
Response format:
{
  "task": "clean task name",
  "priority": "low" | "medium" | "high",
  "dueDate": "YYYY-MM-DD" or null
}
Rules:
- priority: infer from urgency words (urgent/asap/critical = high, soon/this week = medium, someday/eventually = low, default = medium)
- dueDate: resolve relative dates like "tomorrow", "next Friday", "in 3 days" to actual dates. null if no date mentioned.`
      },
      {
        role: 'user',
        content: input
      }
    ],
    temperature: 0.1,
  });

  const raw = completion.choices[0].message.content ?? '';

  try {
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response', raw }, { status: 500 });
  }
}