import React from 'react';

function FilterSection({ filters, onFilterChange }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    return (
        <section className="filter-section">
            <div className="filter-group">
                <span className="filter-label">Category:</span>
                <select className="filter-select" name="category" value={filters.category} onChange={handleChange}>
                    <option value="all">All Categories</option>
                    <option value="Tech">Tech</option>
                    <option value="Web">Web</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Programming">Programming</option>
                    <option value="Data Science">Data Science</option>
                </select>
            </div>
            
            <div className="filter-group">
                <span className="filter-label">Content Type:</span>
                <select className="filter-select" name="type" value={filters.type} onChange={handleChange}>
                    <option value="all">All Types</option>
                    <option value="blog">Blogs</option>
                    <option value="diy">DIY</option>
                    <option value="book">Books</option>
                </select>
            </div>
            
            <div className="filter-group">
                <span className="filter-label">Access:</span>
                <select className="filter-select" name="access" value={filters.access} onChange={handleChange}>
                    <option value="all">All Access</option>
                    <option value="free">Free Access</option>
                    <option value="locked">Members Only</option>
                </select>
            </div>
            
            <div className="filter-group">
                <input
                    type="text"
                    className="search-bar"
                    name="search"
                    placeholder="Search content..."
                    value={filters.search}
                    onChange={handleChange}
                />
            </div>
        </section>
    );
}

export default FilterSection;
