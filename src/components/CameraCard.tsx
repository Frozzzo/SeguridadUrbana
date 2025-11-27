import React, { useState, useEffect } from 'react';
import './CameraCard.css';

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  type: '4G' | 'WiFi';
  color: string;
}

interface Props {
  camera: Camera;
}

const CameraCard: React.FC<Props> = ({ camera }) => {
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate live feed animation
    const interval = setInterval(() => {
      setIsLive((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="camera-card card fade-in">
      <div className="camera-header">
        <div className="camera-info">
          <h3>{camera.name}</h3>
          <p className="text-muted">{camera.location}</p>
        </div>
        <div className="camera-badges">
          <span className={`badge ${camera.status === 'online' ? 'badge-success' : 'badge-danger'}`}>
            {camera.status === 'online' ? '● En línea' : '● Fuera de línea'}
          </span>
          <span className="badge badge-info">{camera.type}</span>
        </div>
      </div>

      <div className="camera-feed" style={{ backgroundColor: camera.color }}>
        {camera.status === 'online' ? (
          <>
            <div className="camera-overlay">
              <div className="camera-icon">📹</div>
              <div className="recording-indicator">
                <span className={isLive ? 'pulse' : ''}>● REC</span>
              </div>
            </div>
            <div className="camera-grid-pattern"></div>
            <div className="camera-timestamp">
              {new Date().toLocaleTimeString('es-ES')}
            </div>
          </>
        ) : (
          <div className="camera-offline">
            <div className="offline-icon">📵</div>
            <p>Cámara fuera de línea</p>
          </div>
        )}
      </div>

      <div className="camera-footer">
        <button className="btn btn-secondary btn-sm">
          <span>👁️</span> Ver en pantalla completa
        </button>
      </div>
    </div>
  );
};

export default CameraCard;
