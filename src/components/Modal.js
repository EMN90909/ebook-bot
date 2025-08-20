import React from 'react';

function Modal({ isOpen, onClose, onSignUp }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal open" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h2 className="modal-title">Members Only Content</h2>
                <p className="modal-text">This content requires an AlgoWhirl account. Please sign in or create an account to access this content.</p>
                <button className="modal-btn" onClick={onSignUp}>Sign Up Now</button>
            </div>
        </div>
    );
}

export default Modal;
