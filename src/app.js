// src/App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FilterSection from './components/FilterSection';
import WelcomeSection from './components/WelcomeSection';
import ContentGrid from './components/ContentGrid';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [contentData, setContentData] = useState({
    blogs: [],
    diy: [],
    books: []
  });
  const [filters, setFilters] = useState({
    category: 'all',
    sort: 'newest',
    type: 'all'
  });
  const [loading, setLoading] = useState(true);

  // Mock data to replace JSON files
  useEffect(() => {
    // Simulating fetching from JSON files
    setTimeout(() => {
      const mockData = {
        blogs: [
          {
            id: 1,
            title: "Understanding Machine Learning",
            description: "A comprehensive guide to machine learning algorithms and their real-world applications.",
            category: "Tech",
            date: "2025-06-15",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            tags: ["AI", "Data Science", "Tutorial"],
            url: "#"
          },
          {
            id: 2,
            title: "The Future of Quantum Computing",
            description: "Exploring the potential of quantum computers to revolutionize industries.",
            category: "Tech",
            date: "2025-07-22",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            tags: ["Quantum", "Physics", "Future Tech"],
            url: "#"
          }
        ],
        diy: [
          {
            id: 1,
            title: "Build Your Own Smart Home Hub",
            description: "Step-by-step guide to creating a DIY smart home controller using Raspberry Pi.",
            category: "Electronics",
            date: "2025-05-10",
            image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
            tags: ["DIY", "Raspberry Pi", "Home Automation"],
            url: "#"
          },
          {
            id: 2,
            title: "3D Printed Drone Project",
            description: "How to design and build your own drone using 3D printing technology.",
            category: "Tech",
            date: "2025-08-01",
            image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            tags: ["3D Printing", "Drones", "DIY"],
            url: "#"
          }
        ],
        books: [
          {
            id: 1,
            title: "Clean Code: A Handbook of Agile Software Craftsmanship",
            description: "Essential reading for developers who want to write maintainable and efficient code.",
            category: "Tech",
            date: "2025-01-15",
            image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            tags: ["Programming", "Best Practices", "Software"],
            url: "#"
          },
          {
            id: 2,
            title: "The Algorithm Design Manual",
            description: "Practical guide to algorithm design with real-world problem-solving techniques.",
            category: "Tech",
            date: "2025-03-30",
            image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
            tags: ["Algorithms", "Computer Science", "Reference"],
            url: "#"
          }
        ]
      };
      setContentData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  return (
    <div className="app">
      <Header />
      <FilterSection 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      <div className="container">
        <WelcomeSection />
        <ContentGrid 
          contentData={contentData} 
          filters={filters} 
          loading={loading} 
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
