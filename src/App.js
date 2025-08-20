import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FilterSection from './components/FilterSection';
import Card from './components/Card';
import Modal from './components/Modal';
import contentData from './data/contentData';
import './index.css';

function App() {
    const [allContent, setAllContent] = useState([]);
    const [filteredContent, setFilteredContent] = useState([]);
    const [filters, setFilters] = useState({
        category: 'all',
        type: 'all',
        access: 'all',
        search: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load data on component mount
    useEffect(() => {
        // In a real app, you would fetch this from an API
        const combinedContent = [
            ...contentData.blogs.map(item => ({ ...item, type: 'blog' })),
            ...contentData.diy.map(item => ({ ...item, type: 'diy' })),
            ...contentData.books.map(item => ({ ...item, type: 'book' })),
        ];
        setAllContent(combinedContent);
        setFilteredContent(combinedContent);
    }, []);

    // Filter content whenever filters or allContent change
    useEffect(() => {
        let currentContent = [...allContent];

        if (filters.category !== 'all') {
            currentContent = currentContent.filter(item => item.category.toLowerCase() === filters.category.toLowerCase());
        }

        if (filters.type !== 'all') {
            currentContent = currentContent.filter(item => item.type.toLowerCase() === filters.type.toLowerCase());
        }

        if (filters.access !== 'all') {
            const requiredMode = filters.access === 'free' ? 'no sign in required' : 'sign in required';
            currentContent = currentContent.filter(item => item.mode === requiredMode);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            currentContent = currentContent.filter(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        setFilteredContent(currentContent);
    }, [filters, allContent]);

    const handleFilterChange = (name, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleCardClick = (item) => {
        if (item.mode === 'sign in required') {
            setIsModalOpen(true);
        } else {
            window.open(item.url, '_blank');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSignUp = () => {
        window.location.href = 'sign-up.html';
    };

    return (
        <div className="App">
            <Header />
            
            <section className="hero">
                <h1>Discover Amazing Content</h1>
                <p>Explore our curated collection of tech articles, DIY projects, and recommended books</p>
            </section>
            
            <FilterSection filters={filters} onFilterChange={handleFilterChange} />
            
            <div className="container">
                <h2 className="section-title"><i className="fas fa-th-large"></i> Featured Content</h2>
                <div className="content-grid">
                    {filteredContent.length > 0 ? (
                        filteredContent.map((item, index) => (
                            <Card key={index} item={item} onCardClick={handleCardClick} />
                        ))
                    ) : (
                        <div className="no-content">No content matching your filters found.</div>
                    )}
                </div>
            </div>
            
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSignUp={handleSignUp}
            />
            
            <footer className="footer">
                <div className="footer-links">
                    <a href="#" className="footer-link">About</a>
                    <a href="#" className="footer-link">Contact</a>
                    <a href="#" className="footer-link">Privacy</a>
                    <a href="#" className="footer-link">Terms</a>
                </div>
                <p>&copy; 2025 AlgoWhirl. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;
