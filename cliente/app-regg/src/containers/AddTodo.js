import React, { Component } from 'react';
import { connect } from 'react-redux';
import FetchHttpClient, { json } from 'fetch-http-client';
import { addTodo } from '../actions/todos';

class AddTodo extends Component {
  state = {
    value: ''
  };
  handleChange = (event) => {
    this.setState({ value: event.currentTarget.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.value.trim()) {
      return;
    }
    // Usar URL relativa al mismo servidor
    const apiUrl = process.env.REACT_APP_API_URL || '';
    const client = new FetchHttpClient(apiUrl);
    client.addMiddleware(json());

    client.post('/texto', {
  json: {
    text: this.state.value,
  },
}).then(response => {
  console.log(response.jsonData);
});
    this.props.dispatch(addTodo(this.state.value));
    this.setState({ value: '' });
  };
  render() {
    return (
      <div className="mb-4">
        <form onSubmit={this.handleSubmit} className="add-todo-form">
          <input 
            className="form-control input-add-todo"
            value={this.state.value} 
            onChange={this.handleChange}
            placeholder="Escribe una nueva tarea..."
          />
          <button type="submit" className="btn btn-add-todo">
            ➕ Agregar
          </button>
        </form>
      </div>
    );
  }
}

export default connect()(AddTodo);
