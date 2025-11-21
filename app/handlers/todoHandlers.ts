export const fetchTodos = async () => {
  const response = await fetch("/api/todos");
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
  return response.json();
};

export const addTodo = async (task: string, priority: string, dueDate: string | null) => {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, priority, dueDate }),
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
  return response.json();
};

export const toggleComplete = async (id: number, completed: boolean) => {
  const response = await fetch(`/api/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !completed }),
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
};

export const deleteTodo = async (id: number) => {
  const response = await fetch(`/api/todos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
};

export const updateTodo = async (updatedTask: string, editTodoId: number) => {
  const response = await fetch(`/api/todos/${editTodoId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: updatedTask }),
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
};

export const parseTask = async (input: string) => {
  const response = await fetch("/api/parse-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
  return response.json();
};