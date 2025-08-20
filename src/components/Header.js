import React from 'react';

function Header() {
    return (
        <header className="header">
            <div className="logo">
                <div className="logo-img">AW</div>
                <div className="logo-text">AlgoWhirl</div>
            </div>
            
            <div className="nav-links">
                <a href="#" className="nav-link">Home</a>
                <a href="#" className="nav-link">Blogs</a>
                <a href="#" className="nav-link">DIY</a>
                <a href="#" className="nav-link">Books</a>
                <a href="sign-up.html" className="nav-link">Sign Up</a>
            </div>
        </header>
    );
}

export default Header;
