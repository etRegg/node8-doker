import React from 'react';

import FilterLink from '../containers/FilterLink';

const Footer = () => (
  <div className="filter-section mt-4">
    <span className="filter-label">🔍 Filtrar por:</span>
    <FilterLink filter="SHOW_ALL">
      Todas
    </FilterLink>
    {' '}
    <FilterLink filter="SHOW_ACTIVE">
      Pendientes
    </FilterLink>
    {' '}
    <FilterLink filter="SHOW_COMPLETED">
      Completadas
    </FilterLink>
  </div>
);

export default Footer;
