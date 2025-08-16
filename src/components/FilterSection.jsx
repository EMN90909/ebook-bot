// src/components/FilterSection.jsx
import React from 'react';

function FilterSection({ filters, onFilterChange }) {
  return (
    <section className="filter-section">
      <div className="filter-group">
        <span className="filter-label">Category:</span>
        <select 
          className="filter-select" 
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="tech">Tech</option>
          <option value="electronics">Electronics</option>
          <option value="cars">Cars</option>
          <option value="cameras">Cameras</option>
        </select>
      </div>
      
      <div className="filter-group">
        <span className="filter-label">Sort by:</span>
        <select 
          className="filter-select" 
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
      
      <div className="filter-group">
        <span className="filter-label">Content Type:</span>
        <select 
          className="filter-select" 
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="blog">Blogs</option>
          <option value="diy">DIY</option>
          <option value="book">Books</option>
        </select>
      </div>
    </section>
  );
}

export default FilterSection;
