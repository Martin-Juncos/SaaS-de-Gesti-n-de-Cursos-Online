import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import { dashboardService } from '../api/services';
import { useAuth } from '../hooks/useAuth';

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError('');
      try {
        const data = await dashboardService.admin(token);
        setDashboard(data);
      } catch (apiError) {
        setError(apiError.message || 'No se pudo cargar el dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [token]);

  if (isLoading) {
    return <p className="muted">Cargando dashboard...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <section className="stack-lg">
      <h1>Dashboard Admin</h1>
      <div className="grid-cards">
        <Card variant="elevated">
          <h2>Usuarios</h2>
          <p className="metric-value">{dashboard?.totalUsers || 0}</p>
        </Card>
        <Card variant="elevated">
          <h2>Cursos</h2>
          <p className="metric-value">{dashboard?.totalCourses || 0}</p>
        </Card>
        <Card variant="elevated">
          <h2>Inscripciones</h2>
          <p className="metric-value">{dashboard?.totalEnrollments || 0}</p>
        </Card>
      </div>
    </section>
  );
}
