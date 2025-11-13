import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CreateTodoSchema = z.object({
  task: z.string().min(1, "Task cannot be empty").max(200),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().optional(),
});

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { id: 'asc' }
  });
  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = CreateTodoSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  const { task, priority, dueDate } = result.data;

  const todo = await prisma.todo.create({
    data: {
      task,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: false,
    }
  });

  return NextResponse.json(todo, { status: 201 });
}