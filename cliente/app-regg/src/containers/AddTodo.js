// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import FetchHttpClient, { json } from 'fetch-http-client';
import { addTodo } from '../actions/todos';

import type { Dispatch } from '../types';

export type Props = {
  dispatch: Dispatch
};

export type State = {
  value: string
};

class AddTodo extends Component<Props, State> {
  input: HTMLInputElement;
  state = {
    value: ''
  };
  handleChange = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    this.setState({ value: event.currentTarget.value });
  };
  handleSubmit = (event: Event) => {
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
      <div>
        <form onSubmit={this.handleSubmit}>
          <input value={this.state.value} onChange={this.handleChange} />
          <button type="submit">
            Add Todo
          </button>
        </form>
      </div>
    );
  }
}

export default connect()(AddTodo);
