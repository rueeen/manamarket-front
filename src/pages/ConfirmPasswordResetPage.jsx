import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { api } from '../api/endpoints';
import { notyf } from '../api/notifier';

export default function ConfirmPasswordResetPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirm) {
      notyf.error('Las contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 8) {
      notyf.error('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await api.confirmPasswordReset({ token, new_password: newPassword });
      notyf.success('Contraseña actualizada. Ya puedes iniciar sesión.');
      navigate('/login');
    } catch {
      // el apiClient ya muestra el error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <div className="panel-card p-4">
        <h4 className="mb-1">Nueva contraseña</h4>
        <p className="text-muted mb-4">Elige una contraseña segura de al menos 8 caracteres.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              className="form-control"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
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
