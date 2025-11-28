# My Tasks - AI-Powered Task Manager

A full-stack task manager built with **Next.js**, **Prisma**, and **OpenAI** - featuring natural language task input that automatically extracts task name, due date, and priority using GPT-4o-mini.

🔗 **Live Demo**: https://todo-app-one-amber-25.vercel.app/

## Features

- **Natural language input** - type "Submit report by Friday, urgent" and AI parses it into a structured task
- **Priority levels** - low, medium, high with color-coded indicators
- **Due dates** - with overdue highlighting
- **Filter** - view All / Active / Completed tasks
- **Full CRUD** - add, edit, complete, delete todos
- **Persistent storage** - PostgreSQL via Neon, managed with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-4o-mini
- **ORM**: Prisma
- **Database**: PostgreSQL (Neon)
- **Validation**: Zod
- **Deploy**: Vercel

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/todos` | Fetch all todos |
| POST | `/api/todos` | Create a new todo |
| PATCH | `/api/todos/:id` | Update task, priority, due date or completed state |
| DELETE | `/api/todos/:id` | Delete a todo |
| POST | `/api/parse-task` | Parse natural language input into structured task via OpenAI |

## Local Setup

1. Clone the repository:
```bash
   git clone https://github.com/nachiket-more99/Todo-app
   cd Todo-app
```

2. Install dependencies:
```bash
   npm install
```

3. Set up environment variables - create a `.env` file:
```
   DATABASE_URL=your_postgresql_connection_string
   OPENAI_API_KEY=your_openai_api_key
```

4. Run database migrations:
```bash
   npx prisma migrate deploy
```

5. Start the development server:
```bash
   npm run dev
```

The app will be running at http://localhost:3000