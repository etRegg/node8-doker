import React from 'react';

const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    className={`todo-item ${completed ? 'completed' : ''}`}
  >
    <span className="todo-text">
      {completed ? '✓ ' : '○ '}
      {text}
    </span>
  </li>
);

export default Todo;
