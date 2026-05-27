import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logoImg from '../images/logo.png';

const menuItems = [
  { to: '/admin/dashboard',       icon: 'bi-speedometer2',  label: 'Dashboard',                    roles: ['admin', 'worker'] },
  { to: '/admin/productos',       icon: 'bi-box-seam',      label: 'Productos',                    roles: ['admin', 'worker'] },
  { to: '/admin/pedidos',         icon: 'bi-receipt',       label: 'Pedidos',                      roles: ['admin', 'worker'] },
  { to: '/admin/kardex',          icon: 'bi-journal-text',  label: 'Kardex',                       roles: ['admin', 'worker'] },
  { to: '/admin/proveedores',     icon: 'bi-truck',         label: 'Proveedores',                  roles: ['admin', 'worker'] },
  { to: '/admin/ordenes-compra',  icon: 'bi-bag-check',     label: 'Órdenes de compra',            roles: ['admin', 'worker'] },
  { to: '/admin/usuarios',        icon: 'bi-people',        label: 'Usuarios',                     roles: ['admin'] },
  { to: '/admin/scryfall-single', icon: 'bi-stars',         label: 'Crear single desde Scryfall',  roles: ['admin'] },
  { to: '/admin/pricing-settings',icon: 'bi-cash-stack',    label: 'Configuración de precios',     roles: ['admin'] },
];

export default function AdminSidebar({ open, onClose }) {
  const { logout, role, isAdmin, isWorker } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => document.body.classList.remove('sidebar-open');
  }, [open]);

  const canSee = (item) => {
    if (isAdmin) return true;
    if (isWorker) return item.roles.includes('worker');
    return item.roles.includes(role);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Overlay móvil */}
      <div
        className={`admin-sidebar-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>

        {/* Header del sidebar — logo + nombre */}
        <div className="admin-sidebar-header">
          <img src={logoImg} alt="ManaMarket" className="admin-sidebar-logo" />
          <div>
            <div className="admin-brand-name">ManaMarket</div>
            <div className="admin-brand-sub">Panel Admin</div>
          </div>
        </div>

        {/* Nav scrolleable */}
        <nav className="admin-sidebar-nav">
          {menuItems.filter(canSee).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Botones fijos abajo */}
        <div className="admin-sidebar-footer">
          <NavLink className="btn btn-outline-secondary w-100" to="/" onClick={onClose}>
            <i className="bi bi-shop me-2" />
            Ver tienda
          </NavLink>
          <button type="button" className="btn btn-primary w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2" />
            Cerrar sesión
          </button>
        </div>

      </aside>
    </>
  );
}
