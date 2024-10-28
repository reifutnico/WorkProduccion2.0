import React from 'react';
import '../css/modalNotificaciones.css';

const ModalNotificaciones = ({ isOpen, onClose, children, title }) => {
    return (
        <div className={`modal-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}>
            <div className={`modal-content ${isOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default ModalNotificaciones;