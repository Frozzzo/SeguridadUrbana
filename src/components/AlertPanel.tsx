import React, { useState } from 'react';
import './AlertPanel.css';

interface Alert {
  id: string;
  userName: string;
  type: 'suspicious' | 'emergency' | 'info';
  message: string;
  location: string;
  createdAt: string;
  read: boolean;
}

interface Props {
  alerts: Alert[];
  onCreateAlert: (type: string, message: string, location: string) => void;
}

const AlertPanel: React.FC<Props> = ({ alerts, onCreateAlert }) => {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'suspicious' | 'emergency' | 'info'>('suspicious');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAlert(type, message, location);
    setMessage('');
    setLocation('');
    setShowForm(false);
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'emergency':
        return '🚨';
      case 'suspicious':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getAlertBadge = (alertType: string) => {
    switch (alertType) {
      case 'emergency':
        return 'badge-danger';
      case 'suspicious':
        return 'badge-warning';
      case 'info':
        return 'badge-info';
      default:
        return 'badge-info';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="alert-panel card">
      <div className="alert-panel-header">
        <h3>Alertas del Vecindario</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancelar' : '+ Nueva Alerta'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="alert-form fade-in">
          <div className="form-group">
            <label>Tipo de Alerta</label>
            <select
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="info">Información</option>
              <option value="suspicious">Sospechoso</option>
              <option value="emergency">Emergencia</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mensaje</label>
            <textarea
              className="input"
              placeholder="Describe la situación..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Ubicación</label>
            <input
              type="text"
              className="input"
              placeholder="Calle 123 #45-67"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Enviar Alerta
          </button>
        </form>
      )}

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="empty-state">
            <p className="text-muted">No hay alertas recientes</p>
          </div>
        ) : (
          alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className={`alert-item ${!alert.read ? 'alert-unread' : ''}`}
            >
              <div className="alert-icon">{getAlertIcon(alert.type)}</div>
              <div className="alert-content">
                <div className="alert-header-item">
                  <span className="alert-user">{alert.userName}</span>
                  <span className={`badge ${getAlertBadge(alert.type)}`}>
                    {alert.type}
                  </span>
                </div>
                <p className="alert-message">{alert.message}</p>
                <div className="alert-footer-item">
                  <span className="text-muted">📍 {alert.location}</span>
                  <span className="text-muted">{formatTime(alert.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertPanel;
