// PostModal.jsx

import { useState } from "react";
import EditPost from "./EditPost";

const moods = {
    1: "Felice",
    2: "Stressato",
    3: "Relax",
    4: "Emozionato",
};

export default function PostModal({ post, onClose, onDelete, onUpdate }) {
    if (!post) return null;

    const [isEditing, setIsEditing] = useState(false);

    // Leggi i tag correttamente
    const tags = post.post_tags?.map(pt => pt.tags) || [];

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={onClose}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div
                className="modal-dialog modal-lg"
                role="document"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {isEditing ? "Modifica Post" : post.title}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        {isEditing ? (
                            <EditPost
                                post={post}
                                onSave={(updatedPost) => {
                                    onUpdate(updatedPost);
                                    setIsEditing(false);
                                }}
                                onCancel={() => setIsEditing(false)}
                            />
                        ) : (
                            <>
                                {post.media_url && (
                                    <div className="text-center mb-3">
                                        <img
                                            src={post.media_url}
                                            alt={post.title}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: "300px", width: "90%" }}
                                        />
                                    </div>
                                )}

                                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "8px" }}>
                                    <div style={{ minWidth: "180px" }}><b>Luogo:</b> {post.location_name}</div>
                                    <div style={{ minWidth: "120px" }}><b>Costo:</b> <span className="text-success fw-bold">{post.cost} €</span></div>
                                </div>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "8px" }}>
                                    <div style={{ minWidth: "150px" }}><b>Sforzo fisico:</b> {post.physical_effort} / 5</div>
                                    <div style={{ minWidth: "150px" }}><b>Sforzo economico:</b> {post.economic_effort} / 5</div>
                                    <div style={{ minWidth: "120px" }}><b>Umore:</b> {moods[post.mood_id]}</div>
                                </div>

                                <p><b>Descrizione:</b> {post.description}</p>
                                <p><b>Riflessione positiva:</b> {post.reflection_positive}</p>
                                <p><b>Riflessione negativa:</b> {post.reflection_negative}</p>

                                {tags.length > 0 && (
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                                        <b>Tag:</b>
                                        {tags.map(tag => (
                                            <span
                                                key={tag.id}
                                                style={{
                                                    backgroundColor: "#1976d2",
                                                    color: "white",
                                                    padding: "2px 8px",
                                                    borderRadius: "12px",
                                                    fontSize: "0.85rem"
                                                }}
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="modal-footer">
                        {!isEditing && (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Modifica
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => onDelete(post.id)}
                                >
                                    Elimina
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                >
                                    Chiudi
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
