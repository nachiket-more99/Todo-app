"use client";

import { useState } from "react";
import { parseTask } from "../handlers/todoHandlers";
import { SparklesIcon } from "@heroicons/react/24/solid";

interface TodoFormProps {
  onAdd: (task: string, priority: string, dueDate: string | null) => void;
}

const priorityColors: Record<string, string> = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

const TodoForm = ({ onAdd }: TodoFormProps) => {
  const [input, setInput] = useState("");
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(false);

  const handleParse = async () => {
    if (!input.trim()) return;
    setParsing(true);
    try {
      const result = await parseTask(input);
      setTask(result.task);
      setPriority(result.priority);
      setDueDate(result.dueDate ?? "");
      setParsed(true);
    } catch (error) {
      console.error("Parse error:", error);
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    onAdd(task, priority, dueDate || null);
    setInput("");
    setTask("");
    setPriority("medium");
    setDueDate("");
    setParsed(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-3">
      {/* Natural language input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setParsed(false); }}
          className="border text-black p-2 pl-4 w-full rounded-full"
          placeholder='Try: "Call client tomorrow, urgent"'
        />
        <button
          type="button"
          onClick={handleParse}
          disabled={parsing}
          className="p-2 px-4 bg-purple-600 text-white rounded-full flex items-center gap-1 whitespace-nowrap"
        >
          <SparklesIcon className="h-4 w-4" />
          {parsing ? "Parsing..." : "AI Parse"}
        </button>
      </div>

      {/* Parsed fields */}
      {parsed && (
        <div className="bg-gray-700 p-3 rounded-lg space-y-2">
          <p className="text-xs text-gray-400 mb-2">AI parsed — review and confirm:</p>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="border text-black p-2 pl-4 w-full rounded-full"
            placeholder="Task name"
          />
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border text-black p-2 pl-4 rounded-full flex-1"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border text-black p-2 pl-4 rounded-full flex-1"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-full"
          >
            Add Task
          </button>
        </div>
      )}

      {/* Manual add without AI */}
      {!parsed && (
        <button
          type="button"
          onClick={() => setParsed(true)}
          className="w-full p-2 bg-gray-600 text-white rounded-full text-sm"
        >
          + Add manually
        </button>
      )}
    </form>
  );
};

export default TodoForm;