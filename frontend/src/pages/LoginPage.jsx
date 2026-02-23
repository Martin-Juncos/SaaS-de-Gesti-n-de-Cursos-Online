import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard/home';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (apiError) {
      setError(apiError.message || 'No se pudo iniciar sesion');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-section">
      <Card className="auth-card" variant="elevated">
        <h1>Iniciar sesion</h1>
        <p className="muted">Accede como alumno, instructor o admin.</p>
        <form onSubmit={handleSubmit} className="stack-md">
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            id="password"
            label="Contrasena"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && <p className="error-text">{error}</p>}
          <Button type="submit" disabled={isSubmitting} fullWidth>
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
        <p className="muted">
          No tenes cuenta? <Link to="/register">Registrate</Link>
        </p>
      </Card>
    </section>
  );
}
