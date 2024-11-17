import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';  // Import the CSS file

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    axios.get('/api/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error(error));
  }, []);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    axios.post('/api/todos', { task: newTodo })
      .then(response => setTodos([...todos, response.data]))
      .catch(error => console.error(error));
    setNewTodo('');
  };

  const toggleComplete = (id) => {
    const todo = todos.find(todo => todo._id === id);
    axios.patch(`/api/todos/${id}`, { completed: !todo.completed })
      .then(response => setTodos(todos.map(todo => todo._id === id ? response.data : todo)))
      .catch(error => console.error(error));
  };

  const deleteTodo = (id) => {
    axios.delete(`/api/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(error => console.error(error));
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <div>
        <input 
          type="text" 
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)} 
          placeholder="Add a new task" 
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo._id} className={todo.completed ? 'completed' : ''}>
            <span>{todo.task}</span>
            <button 
              className="complete-btn" 
              onClick={() => toggleComplete(todo._id)}
            >
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button 
              className="delete-btn" 
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
