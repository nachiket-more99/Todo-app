"use client";

import { useState } from "react";
import { parseTask } from "../handlers/todoHandlers";
import { SparklesIcon } from "@heroicons/react/24/solid";

interface TodoFormProps {
  onAdd: (task: string, priority: string, dueDate: string | null) => void;
}

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
    <div className="mb-6">
      {/* NL input row */}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setParsed(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleParse()}
          className="flex-1 bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder='e.g. "Call client tomorrow, urgent"'
        />
        <button
          type="button"
          onClick={handleParse}
          disabled={parsing || !input.trim()}
          className="flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
        >
          <SparklesIcon className="h-4 w-4" />
          {parsing ? "Parsing..." : "AI Parse"}
        </button>
      </div>

      {!parsed && (
        <button
          type="button"
          onClick={() => { setTask(""); setPriority("medium"); setDueDate(""); setParsed(true); }}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          + Add manually instead
        </button>
      )}

      {parsed && (
        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3 mt-2">
          <p className="text-xs text-indigo-400 font-semibold uppercase tracking-widest">
            {input.trim() ? "✦ AI parsed — review and confirm" : "New task"}
          </p>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            autoFocus
            className="w-full bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Task name"
          />
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700 text-gray-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700 text-gray-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!task.trim()}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => setParsed(false)}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TodoForm;