import React from 'react';
import CameraCard from './CameraCard';
import './CameraGrid.css';

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  type: '4G' | 'WiFi';
  color: string;
}

interface Props {
  cameras: Camera[];
}

const CameraGrid: React.FC<Props> = ({ cameras }) => {
  return (
    <div className="camera-grid">
      {cameras.map((camera) => (
        <CameraCard key={camera.id} camera={camera} />
      ))}
    </div>
  );
};

export default CameraGrid;
