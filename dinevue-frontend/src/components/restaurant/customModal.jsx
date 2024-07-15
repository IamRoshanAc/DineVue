import React from 'react';
import '../../style/customModal.css'; // Import your custom CSS

const CustomModal = ({ show, onHide, title, children, onSave }) => {
    if (!show) return null;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal">
                <div className="custom-modal-header">
                    <h2>{title}</h2>
                    <button className="custom-modal-close" onClick={onHide}>×</button>
                </div>
                <div className="custom-modal-body">
                    {children}
                </div>
                <div className="custom-modal-footer">
                    {onSave && <button className="custom-modal-button custom-modal-button-primary" onClick={onSave}>Save</button>}
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
