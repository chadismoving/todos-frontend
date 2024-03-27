import { Check, RotateCcw, Trash2 } from 'lucide-react';
import useSWR, { useSWRConfig } from 'swr';

interface Todos {
  id: number;
  todo: string;
  is_completed: number;
}

const FetchTodos = () => {
  const { mutate } = useSWRConfig();
  
  // Updated URL to Cloudflare Worker endpoint
  const todosEndpoint = 'https://cl-todos-back.d.htd.ink/todos';

  const fetchTodos = async () => {
    const res = await fetch(todosEndpoint);
    const resData = await res.json();
    return resData.data;
  };

  const { data, error } = useSWR<Todos[], Error>('/todos', fetchTodos);

  const updateTodo = async (todoId: number, todoStatus: boolean) => {
    try {
      await fetch(`${todosEndpoint}/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_completed: todoStatus }),
      });

      mutate('/todos');
    } catch (error) {
      console.error('Error while updating todo', error);
    }
  };

  const handleDelete = async (todoId: number) => {
    try {
      await fetch(`${todosEndpoint}/${todoId}`, {
        method: 'DELETE',
      });

      mutate('/todos');
    } catch (error) {
      console.error('Error while deleting todo', error);
    }
  };

  if (error) {
    return (
      <div className="error-card">
        <p>Error while fetching todos</p>
      </div>
    );
  }

  return (
    <div>
      <div className="todos-list">
        {data?.map((todo) => (
          <div
            className={`todo-item ${todo.is_completed ? 'complete' : ''}`}
            key={todo.id}
          >
            <p>{todo.todo}</p>
            <div className="todo-actions">
              {!todo.is_completed && (
                <div className="todo-action complete">
                  <Check onClick={() => updateTodo(todo.id, true)} />
                </div>
              )}
              {todo.is_completed && (
                <div className="todo-action redo">
                  <RotateCcw onClick={() => updateTodo(todo.id, false)} />
                </div>
              )}
              <div
                className="todo-action delete"
                onClick={() => handleDelete(todo.id)}
              >
                <Trash2 />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FetchTodos;
