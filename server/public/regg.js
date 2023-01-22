'use strict';

import React from "react";

const e = React.createElement;
class Comment extends React.Component {
	  render() {
	    return e(
	    		'<div class="card" style="width: 18rem;"><div class="card-body"><h5 class="card-title">Comment</h5><p class="card-text">'+
	    		this.props.name
	    		+'</p> </div></div>'
	    );
	  }
	
}
class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked comment number ' + this.props.commentID;
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}
document.querySelectorAll('.comment').forEach(te =>{
ReactDOM.render(e(
		Comment,
		{name:'acoment'}
		,te));
});
// Find all DOM containers, and render Like buttons into them.
document.querySelectorAll('.like_button_container')
  .forEach(domContainer => {
    // Read the comment ID from a data-* attribute.
    const commentID = parseInt(domContainer.dataset.commentid, 10);
    ReactDOM.render(
      e(LikeButton, { commentID: commentID }),
      domContainer
    );
  });
