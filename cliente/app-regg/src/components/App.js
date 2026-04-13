import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


import Footer from './Footer';
import AddTodo from '../containers/AddTodo';
import VisibleTodoList from '../containers/VisibleTodoList';

const App = () => (
  <div className="app-container">
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-lg">
        <span className="navbar-brand">📝 Mi Lista TODO</span>
      </div>
    </nav>

    <div className="container-lg">
      <div className="row mt-5">
        <div className="col-lg-8 mx-auto">
          <div className="card todo-card">
            <div className="card-header">
              <h4>Mis Tareas</h4>
            </div>
            <div className="card-body">
              <AddTodo />
              <VisibleTodoList />
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default App;
