import React from 'react';

import Todo from './Todo';

const TodoList = ({ todos, onTodoClick }) => (
  <ul className="todo-list">
    {todos.length === 0 ? (
      <li className="alert alert-info">
        ✨ No hay tareas. ¡Agrega una nueva!
      </li>
    ) : (
      todos.map(todo => (
        <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
      ))
    )}
  </ul>
);

export default TodoList;
