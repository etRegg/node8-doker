const createTodo = (id, text) => ({
  id,
  text,
  completed: false
});

const toggleTodo = (todos, id) =>
  todos.map(t => (t.id !== id ? t : { ...t, completed: !t.completed }));

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, createTodo(action.id, action.text)];
    case 'TOGGLE_TODO':
      return toggleTodo(state, action.id);
    default:
      return state;
  }
};

export default todos;
