import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';

export default function AppLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navClassName = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;
  const homePath = isAuthenticated ? '/dashboard/home' : '/courses';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <Link to={homePath} className="brand">
            <span className="brand-mark" aria-hidden="true" />
            Course SaaS
          </Link>
          <nav className="main-nav">
            {isAuthenticated && (
              <NavLink to="/dashboard/home" className={navClassName}>
                Inicio
              </NavLink>
            )}
            <NavLink to="/courses" className={navClassName}>
              Cursos
            </NavLink>
            {isAuthenticated && user?.role === 'student' && (
              <NavLink to="/dashboard/student" className={navClassName}>
                Mi progreso
              </NavLink>
            )}
            {isAuthenticated && user?.role === 'instructor' && (
              <NavLink to="/dashboard/instructor" className={navClassName}>
                Dashboard Instructor
              </NavLink>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <NavLink to="/dashboard/admin" className={navClassName}>
                Dashboard Admin
              </NavLink>
            )}
          </nav>
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <span className="user-chip">
                  {user.fullName} ({user.role})
                </span>
                <Button variant="secondary" size="sm" onClick={logout}>
                  Cerrar sesion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="link-pill">
                  Ingresar
                </Link>
                <Link to="/register" className="link-pill link-pill-strong">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="app-container">
        <Outlet />
      </main>
    </div>
  );
}
