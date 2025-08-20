import React from 'react';

function Card({ item, onCardClick }) {
    const handleCardClick = () => {
        onCardClick(item);
    };

    const displayDate = new Date(item.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const imageStyle = item.picture
        ? { backgroundImage: `url('${item.picture}')` }
        : { background: `linear-gradient(135deg, ${item.type === 'blog' ? '#0071e3' : item.type === 'diy' ? '#34c759' : '#bf5af2'})` };

    const accessClass = item.mode === 'no sign in required' ? 'free' : 'locked';
    const accessText = item.mode === 'no sign in required' ? 'Free' : 'Members Only';

    return (
        <div className="card" onClick={handleCardClick}>
            <div className="card-image" style={imageStyle}>
                <div className="card-category">{item.category}</div>
                <div className={`card-access ${accessClass}`}>
                    {accessText}
                </div>
            </div>
            <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.description}</p>
                <div className="card-date">
                    <i className="far fa-calendar"></i> {displayDate}
                </div>
                <div className="card-tags">
                    {item.tags.map(tag => (
                        <span key={tag} className="card-tag">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Card;
