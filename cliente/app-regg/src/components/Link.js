import React from 'react';

const Link = ({ active, children, onClick }) => {
  if (active) {
    return (
      <span className="filter-link active">
        {children}
      </span>
    );
  }

  return (
    <a 
      href="#"
      className="filter-link"
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

export default Link;
