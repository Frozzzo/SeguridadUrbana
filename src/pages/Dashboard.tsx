import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { socketService } from '../services/socket';
import CameraGrid from '../components/CameraGrid';
import AlertPanel from '../components/AlertPanel';
import EmergencyContacts from '../components/EmergencyContacts';
import './Dashboard.css';

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  type: '4G' | 'WiFi';
  color: string;
}

interface Alert {
  id: string;
  userName: string;
  type: 'suspicious' | 'emergency' | 'info';
  message: string;
  location: string;
  createdAt: string;
  read: boolean;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: string;
  available24h: boolean;
}

const Dashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    setupWebSocket();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadData = async () => {
    try {
      if (!token) return;
      
      const [camerasData, alertsData, contactsData] = await Promise.all([
        api.getCameras(token),
        api.getAlerts(token),
        api.getEmergencyContacts(token),
      ]);

      setCameras(camerasData);
      setAlerts(alertsData);
      setContacts(contactsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const socket = socketService.connect();

    socketService.on('newAlert', (alert: Alert) => {
      setAlerts((prev) => [alert, ...prev]);
      
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Nueva Alerta', {
          body: alert.message,
          icon: '/icon-192.png',
        });
      }
    });

    socketService.on('cameraStatusUpdated', (camera: Camera) => {
      setCameras((prev) =>
        prev.map((c) => (c.id === camera.id ? camera : c))
      );
    });
  };

  const handleCreateAlert = async (type: string, message: string, location: string) => {
    try {
      if (!token) return;
      await api.createAlert(token, { type, message, location });
      await loadData();
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-small">🛡️</div>
            <div>
              <h1>Seguridad Urbana</h1>
              <p className="text-muted">Bienvenido, {user?.name}</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
              <div className="user-details">
                <p className="user-name">{user?.name}</p>
                <p className="user-address text-muted">{user?.address}</p>
              </div>
            </div>
            <button onClick={logout} className="btn btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content container">
        <div className="dashboard-grid">
          <div className="main-section">
            <div className="section-header">
              <h2>Cámaras del Vecindario</h2>
              <span className="badge badge-success">
                {cameras.filter((c) => c.status === 'online').length} en línea
              </span>
            </div>
            <CameraGrid cameras={cameras} />
          </div>

          <aside className="sidebar">
            <AlertPanel alerts={alerts} onCreateAlert={handleCreateAlert} />
            <EmergencyContacts contacts={contacts} />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
