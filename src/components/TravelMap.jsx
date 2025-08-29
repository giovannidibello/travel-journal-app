// TravelMap.jsx

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function ResizeHandler() {
    const map = useMap();

    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 200);
    }, [map]);

    return null;
}

export default function TravelMap({ events, onPostClick, onAddPostClick }) {
    const createIcon = (post) => {
        return new L.DivIcon({
            html: `
        <div style="
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #1976d2;
          cursor: pointer;
        ">
          <img src="${post.media_url}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />
        </div>
      `,
            className: "",
            iconSize: [60, 60],
            iconAnchor: [30, 60],
        });
    };

    return (
        <div style={{ position: "relative", width: "100%", height: "400px" }}>
            <MapContainer
                center={[45.465454, 12.4964]} // centro mappa Italia
                zoom={5}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ResizeHandler />
                {events.map((post) => (
                    <Marker
                        key={post.id}
                        position={[post.lat, post.lng]}
                        icon={createIcon(post)}
                        eventHandlers={{ click: () => onPostClick(post) }}
                    >
                        <Popup>
                            <strong>{post.title}</strong>
                            <br />
                            {post.location_name}
                            <br />€ {post.cost}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Bottone flottante aggiungi post */}
            <button
                onClick={onAddPostClick}
                style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    padding: "12px 18px",
                    borderRadius: "50%",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                    zIndex: 1000,
                }}
            >
                +
            </button>
        </div>
    );
}
