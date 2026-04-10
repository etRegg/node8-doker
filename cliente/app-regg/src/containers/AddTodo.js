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
    const client = new FetchHttpClient('http://172.23.18.10:8080');
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
        <form onSubmit={this.handleSubmit} className="d-flex gap-2">
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
