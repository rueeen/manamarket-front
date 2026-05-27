import { useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../api/endpoints';

export default function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.requestPasswordReset({ email });
      setSent(true);
    } catch {
      // el apiClient ya muestra el error
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="container py-5" style={{ maxWidth: 480 }}>
        <div className="panel-card p-4 text-center">
          <i className="bi bi-envelope-check fs-1 text-success mb-3 d-block" />
          <h4>Revisa tu correo</h4>
          <p className="text-muted">
            Si el correo está registrado, recibirás un enlace para restablecer tu contraseña en
            los próximos minutos.
          </p>
          <Link to="/login" className="btn btn-primary mt-2">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <div className="panel-card p-4">
        <h4 className="mb-1">Recuperar contraseña</h4>
        <p className="text-muted mb-4">
          Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" className="text-muted small">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
