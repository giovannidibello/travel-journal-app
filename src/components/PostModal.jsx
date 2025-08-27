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
                        {post.media_url && (
                            <img src={post.media_url} alt={post.title} className="img-fluid rounded mb-4" />
                        )}

                        <div className="row">
                            <div className="col-md-6">
                                <p><span className="fw-bold">Luogo:</span> {post.location_name}</p>
                                <p>
                                    <span className="fw-bold">Data:</span>{" "}
                                    {new Date(post.created_at).toLocaleDateString("it-IT", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                                <p><span className="fw-bold">Descrizione:</span> {post.description}</p>
                                <p><span className="fw-bold">Umore:</span> {post.moods ? post.moods.name : "Nessun mood"}</p>
                            </div>

                            <div className="col-md-6">
                                <p><span className="fw-bold">Riflessione positiva:</span> {post.reflection_positive}</p>
                                <p><span className="fw-bold">Riflessione negativa:</span> {post.reflection_negative}</p>
                                <p>
                                    <span className="fw-bold">Sforzo fisico:</span>{" "}
                                    <span className="badge bg-warning text-dark">{post.physical_effort}</span>
                                </p>
                                <p>
                                    <span className="fw-bold">Sforzo economico:</span>{" "}
                                    <span className="badge bg-info text-dark">{post.economic_effort}</span>
                                </p>
                                <p><span className="fw-bold">Costo:</span> <span className="text-success fw-bold">{post.cost} €</span></p>
                            </div>
                        </div>

                        <div className="mt-3">
                            <p className="fw-bold">Tags:</p>
                            <div>
                                {post.post_tags?.length > 0
                                    ? post.post_tags.map((pt, i) => (
                                        <span key={i} className="badge bg-primary me-1">{pt.tags.name}</span>
                                    ))
                                    : <span className="text-muted">Nessun tag</span>}
                            </div>
                        </div>
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