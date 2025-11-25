"use client";

import { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import Modal from "./Modal";
import { fetchTodos, addTodo, toggleComplete, deleteTodo, updateTodo } from '../handlers/todoHandlers';

interface Todo {
  id: number;
  task: string;
  completed: boolean;
  priority: string;
  dueDate: string | null;
}

type Filter = "all" | "active" | "completed";

const priorityLeft: Record<string, string> = {
  low: "border-l-emerald-500",
  medium: "border-l-amber-400",
  high: "border-l-rose-500",
};

const priorityDotColor: Record<string, string> = {
  low: "bg-emerald-500",
  medium: "bg-amber-400",
  high: "bg-rose-500",
};

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState("");
  const [editTodoId, setEditTodoId] = useState<number | null>(null);

  const handleFetchTodo = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async (task: string, priority: string, dueDate: string | null) => {
    try {
      await addTodo(task, priority, dueDate);
      await handleFetchTodo();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      await toggleComplete(id, completed);
      await handleFetchTodo();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      await handleFetchTodo();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleUpdateTodo = async (updatedTask: string, id: number) => {
    try {
      await updateTodo(updatedTask, id);
      await handleFetchTodo();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const editTodo = (id: number, task: string) => {
    setEditTodoId(id);
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  useEffect(() => { handleFetchTodo(); }, []);

  const filtered = todos.filter(t =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed
  );

  const activeCount = todos.filter(t => !t.completed).length;

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date(new Date().toDateString());
  };

  return (
    <div className="max-w-lg mx-auto mt-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
  My Tasks
</h1>
        <p className="text-gray-500 text-sm mt-1">
          {activeCount} task{activeCount !== 1 ? "s" : ""} remaining
        </p>
      </div>

      <TodoForm onAdd={handleAddTodo} />

      {/* Filter bar */}
      <div className="flex gap-1 mb-5 bg-gray-900 p-1 rounded-xl">
        {(["all", "active", "completed"] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 text-sm font-medium capitalize rounded-lg transition-all ${
              filter === f
                ? "bg-gray-700 text-white shadow"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Todo list */}
      <ul className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <p className="text-3xl mb-2">✓</p>
            <p className="text-sm">
              {filter === "completed" ? "No completed tasks yet" :
               filter === "active" ? "All done — nothing left!" :
               "No tasks yet. Add one above!"}
            </p>
          </div>
        )}

        {filtered.map((todo) => (
          <li
            key={todo.id}
            className={`border-l-4 ${priorityLeft[todo.priority]} bg-gray-800 rounded-r-xl px-4 py-3 transition-opacity ${todo.completed ? "opacity-50" : "opacity-100"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id, todo.completed)}
                  className="custom-checkbox"
                />
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${todo.completed ? "line-through text-gray-500" : "text-gray-100"}`}>
                    {todo.task}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${priorityDotColor[todo.priority]}`}></span>
                      {todo.priority}
                    </span>
                    {todo.dueDate && (
                      <span className={`text-xs font-medium ${isOverdue(todo.dueDate) && !todo.completed ? "text-rose-400" : "text-gray-500"}`}>
                        {isOverdue(todo.dueDate) && !todo.completed ? "⚠ Overdue · " : "Due: "}
                        {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => editTodo(todo.id, todo.task)}>
<PencilSquareIcon className="h-4 w-4 text-gray-400 hover:text-indigo-400 transition-colors" />                </button>
                <button onClick={() => handleDeleteTodo(todo.id)}>
<TrashIcon className="h-4 w-4 text-gray-400 hover:text-rose-400 transition-colors" />                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={currentTask}
        editTodoId={editTodoId ?? 0}
        onUpdate={handleUpdateTodo}
      />
    </div>
  );
};

export default TodoList;