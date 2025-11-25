import TodoList from './components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 p-6 md:p-10">
      <TodoList />
    </main>
  );
}