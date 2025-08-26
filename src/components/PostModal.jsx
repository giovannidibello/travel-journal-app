// PostModal.jsx

import React from 'react';

export default function PostModal({ post, onClose }) {
    if (!post) return null;

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={onClose} // chiudi cliccando fuori
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div
                className="modal-dialog modal-lg"
                role="document"
                onClick={(e) => e.stopPropagation()} // non chiudere cliccando dentro modale
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{post.title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p><strong>Luogo:</strong> {post.location_name}</p>
                        <p><strong>Data:</strong> {new Date(post.created_at).toLocaleString()}</p>
                        <p><strong>Descrizione:</strong> {post.description}</p>
                        <p><strong>Umore:</strong>{post.moods ? post.moods.name : 'Nessun mood'}</p>
                        <p><strong>Riflessione positiva:</strong> {post.reflection_positive}</p>
                        <p><strong>Riflessione negativa:</strong> {post.reflection_negative}</p>
                        <p><strong>Sforzo fisico:</strong> {post.physical_effort}</p>
                        <p><strong>Sforzo economico:</strong> {post.economic_effort}</p>
                        <p><strong>Costo:</strong> {post.cost} €</p>
                        <p><strong>Tags:</strong> {' '}
                            {post.post_tags?.map(pt => pt.tags.name).join(', ') || 'Nessun tag'}</p>
                        <div>
                            {(Array.isArray(post.tags) ? post.tags : post.tags?.split(',').map(t => t.trim()) || []).map((tag, i) => (
                                <span key={i} className="badge bg-primary me-1">{tag}</span>
                            ))}
                        </div>
                        {post.media_url && (
                            <img src={post.media_url} alt={post.title} className="img-fluid" />
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Chiudi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}