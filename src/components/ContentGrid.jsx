// src/components/ContentGrid.jsx
import React from 'react';
import Card from './Card';

function ContentGrid({ contentData, filters, loading }) {
  // Filter and sort content
  const filterContent = () => {
    let filteredContent = [];
    
    // Combine all content based on type filter
    if (filters.type === 'all') {
      filteredContent = [
        ...contentData.blogs.map(item => ({ ...item, type: 'blog' })),
        ...contentData.diy.map(item => ({ ...item, type: 'diy' })),
        ...contentData.books.map(item => ({ ...item, type: 'book' }))
      ];
    } else if (filters.type === 'blog') {
      filteredContent = contentData.blogs.map(item => ({ ...item, type: 'blog' }));
    } else if (filters.type === 'diy') {
      filteredContent = contentData.diy.map(item => ({ ...item, type: 'diy' }));
    } else if (filters.type === 'book') {
      filteredContent = contentData.books.map(item => ({ ...item, type: 'book' }));
    }
    
    // Apply category filter
    if (filters.category !== 'all') {
      filteredContent = filteredContent.filter(item => {
        return (item.category && item.category.toLowerCase() === filters.category) || 
              (item.tags && item.tags.some(tag => tag.toLowerCase() === filters.category));
      });
    }
    
    // Sort content
    filteredContent.sort((a, b) => {
      const dateA = new Date(a.date || '1970-01-01');
      const dateB = new Date(b.date || '1970-01-01');
      
      if (filters.sort === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
    
    return filteredContent;
  };

  if (loading) {
    return (
      <div className="content-grid" id="content-container">
        <div className="loading-message">Loading content...</div>
      </div>
    );
  }

  const filteredContent = filterContent();

  if (filteredContent.length === 0) {
    return (
      <div className="content-grid" id="content-container">
        <div className="no-content">No content matching your filters found.</div>
      </div>
    );
  }

  return (
    <div className="content-grid" id="content-container">
      {filteredContent.map(item => (
        <Card key={`${item.type}-${item.id}`} item={item} />
      ))}
    </div>
  );
}

export default ContentGrid;
