import React, { useState } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { TodoItem } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TodoListProps {
  theme: any;
}

const TodoList: React.FC<TodoListProps> = ({ theme }) => {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('todos', []);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Mes Tâches</h1>
        <p style={{ color: theme.accent }}>
          {completedCount} sur {todos.length} terminées
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 mb-6">
        <div className="flex space-x-2 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Nouvelle tâche..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <button
            onClick={addTodo}
            className="px-4 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: theme.primary }}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {todos.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <p style={{ color: theme.accent }}>Aucune tâche pour le moment</p>
              <p className="text-white/60 text-sm mt-2">Ajoutez votre première tâche ci-dessus</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                  todo.completed ? 'bg-white/5' : 'bg-white/10'
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    todo.completed
                      ? 'border-green-500 bg-green-500'
                      : 'border-white/30 hover:border-white/50'
                  }`}
                >
                  {todo.completed && <Check className="w-4 h-4 text-white" />}
                </button>
                
                <span
                  className={`flex-1 transition-all duration-200 ${
                    todo.completed
                      ? 'text-white/60 line-through'
                      : 'text-white'
                  }`}
                >
                  {todo.text}
                </span>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {todos.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Progression</span>
            <span style={{ color: theme.accent }} className="font-medium">
              {Math.round((completedCount / todos.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mt-2">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                backgroundColor: theme.primary,
                width: `${(completedCount / todos.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;