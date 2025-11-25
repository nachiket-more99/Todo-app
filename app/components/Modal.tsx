"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Modal = ({ isOpen, onClose, task, editTodoId, onUpdate }: {
  isOpen: boolean;
  onClose: () => void;
  task: string;
  editTodoId: number;
  onUpdate: (updatedTask: string, editTodoId: number) => void;
}) => {
  const [updatedTask, setUpdatedTask] = useState<string>(task);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(updatedTask, editTodoId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="relative bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-2xl w-full max-w-sm mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
          Edit Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={updatedTask}
            onChange={(e) => setUpdatedTask(e.target.value)}
            autoFocus
            className="w-full bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Update task name..."
          />
          <button
            type="submit"
            disabled={!updatedTask.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Update Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;