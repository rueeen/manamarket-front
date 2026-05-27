import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/endpoints';
import { notyf } from '../api/notifier';

const roleLabels = {
  admin: 'Administrador',
  worker: 'Trabajador',
  customer: 'Cliente',
};

const roleBadgeClass = {
  admin: 'badge-warning',
  worker: 'badge-success',
  customer: 'badge-soft',
};

export default function ProfilePage() {
  const { user, persistSession } = useAuth();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirm: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) {
    return (
      <div className="panel-card p-4 text-center text-muted">
        Cargando perfil...
      </div>
    );
  }

  const role = user.role || 'customer';
  const roleLabel = roleLabels[role] || 'Cliente';

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.new_password_confirm) {
      notyf.error('Las contraseñas nuevas no coinciden.');
      return;
    }

    if (passwordData.new_password.length < 8) {
      notyf.error('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setSavingPassword(true);

    try {
      const { data } = await api.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        refresh_token: localStorage.getItem('refreshToken') || '',
      });

      // El backend rota los tokens — guardar los nuevos
      if (data.access && data.refresh) {
        persistSession({ access: data.access, refresh: data.refresh });
      }

      notyf.success('Contraseña actualizada correctamente.');
      setPasswordData({ current_password: '', new_password: '', new_password_confirm: '' });
      setShowPasswordForm(false);
    } catch {
      // El apiClient ya muestra el error.
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="panel-card p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4">
        <div>
          <h2 className="mb-1">Mi perfil</h2>
          <p className="text-muted mb-0">
            Información básica de tu cuenta.
          </p>
        </div>

        <span className={`badge ${roleBadgeClass[role] || 'badge-soft'}`}>
          {roleLabel}
        </span>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="panel-card p-3 h-100">
            <span className="text-muted small">Usuario</span>
            <div className="fs-5">{user.username || '-'}</div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="panel-card p-3 h-100">
            <span className="text-muted small">Email</span>
            <div className="fs-5">{user.email || '-'}</div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="panel-card p-3 h-100">
            <span className="text-muted small">Nombre</span>
            <div className="fs-5">
              {[user.first_name, user.last_name].filter(Boolean).join(' ') || '-'}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="panel-card p-3 h-100">
            <span className="text-muted small">Rol</span>
            <div className="fs-5">{roleLabel}</div>
          </div>
        </div>
      </div>

      {/* Cambio de contraseña */}
      <div className="panel-card p-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Contraseña</h6>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setShowPasswordForm((v) => !v)}
          >
            {showPasswordForm ? 'Cancelar' : 'Cambiar contraseña'}
          </button>
        </div>

        {showPasswordForm && (
          <form className="mt-3" onSubmit={submitPasswordChange}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Contraseña actual</label>
                <input
                  type="password"
                  className="form-control"
                  name="current_password"
                  required
                  autoComplete="current-password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="new_password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="new_password_confirm"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={passwordData.new_password_confirm}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingPassword}
                >
                  {savingPassword ? 'Guardando...' : 'Guardar nueva contraseña'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
