import React, { useEffect, useState } from 'react';
import service from './service.js';
import './app.css';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);

  async function getTodos() {
    const todos = await service.getTasks();
    setTodos(todos);
  }

  async function createTodo(e) {
    e.preventDefault();
    if (newTodo.trim()) {
      await service.addTask(newTodo);
      setNewTodo(""); // Clear input field
      await getTodos(); // Refresh task list
    }
  }

  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo.id, todo.name, isComplete);
    await getTodos(); // Refresh task list
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos(); // Refresh task list
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="container">
      <div className="left-section">
        <h2>Welcome to your Task Manager</h2>
        <p>Keep track of your daily tasks🫨, stay productive🙂‍↕️, and never miss anything!</p>
      </div>

      <div className="todoapp">
        <header className="header">
          <form onSubmit={createTodo} className="todo-form">
            <input 
              className="new-todo" 
              placeholder="Add your tasks for the day..." 
              value={newTodo} 
              onChange={(e) => setNewTodo(e.target.value)} 
              autoFocus
            />
          </form>
        </header>
        <div className="main">
          <ul className="todo-list">
            {todos.map(todo => (
              <li className={`todo-item ${todo.isComplete ? "completed" : ""}`} key={todo.id}>
                <div className="view">
                  <input 
                    className="toggle" 
                    type="checkbox" 
                    defaultChecked={todo.isComplete} 
                    onChange={(e) => updateCompleted(todo, e.target.checked)} 
                  />
                  <label>{todo.name}</label>
                  <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <footer className="footer">
          <p className="footer-text">Good Luck🙌</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
