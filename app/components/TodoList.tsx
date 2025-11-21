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

const priorityBadge: Record<string, string> = {
  low: "bg-green-600",
  medium: "bg-yellow-600",
  high: "bg-red-600",
};

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
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

  const handleUpdateTodo = async (updatedTask: string, editTodoId: number) => {
    if (editTodoId != null) {
      try {
        await updateTodo(updatedTask, editTodoId);
        await handleFetchTodo();
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }
  };

  const editTodo = (id: number, task: string) => {
    setEditTodoId(id);
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  useEffect(() => {
    handleFetchTodo();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>

      <TodoForm onAdd={handleAddTodo} />

      <ul className="space-y-2 mt-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="p-3 bg-gray-700 rounded-lg flex justify-between items-center"
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id, todo.completed)}
                className="mr-2 shrink-0"
              />
              <div className="min-w-0">
                <span className={`block truncate ${todo.completed ? "line-through text-gray-400" : ""}`}>
                  {todo.task}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full text-white ${priorityBadge[todo.priority]}`}>
                    {todo.priority}
                  </span>
                  {todo.dueDate && (
                    <span className="text-xs text-gray-400">
                      Due: {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 shrink-0 ml-2">
              <PencilSquareIcon
                onClick={() => editTodo(todo.id, todo.task)}
                className="h-5 w-5 text-blue-400 cursor-pointer"
              />
              <TrashIcon
                onClick={() => handleDeleteTodo(todo.id)}
                className="h-5 w-5 text-red-400 cursor-pointer"
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Modal rendered once outside the map */}
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