import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password, name, address);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(isRegister ? 'Error al registrarse. Intenta de nuevo.' : 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <div className="login-card fade-in">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">🛡️</div>
          </div>
          <h1>Seguridad Urbana</h1>
          <p className="text-secondary">Sistema de vigilancia comunitaria</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          {isRegister && (
            <>
              <div className="form-group">
                <label htmlFor="name">Nombre Completo</label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Dirección</label>
                <input
                  id="address"
                  type="text"
                  className="input"
                  placeholder="Calle 123 #45-67"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? (
              <span className="pulse">Cargando...</span>
            ) : (
              <>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</>
            )}
          </button>

          <div className="form-footer">
            <button
              type="button"
              className="link-button"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </form>

        <div className="login-features">
          <div className="feature-item">
            <span className="feature-icon">📹</span>
            <span>Cámaras en tiempo real</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚨</span>
            <span>Alertas instantáneas</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📞</span>
            <span>Contactos de emergencia</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
