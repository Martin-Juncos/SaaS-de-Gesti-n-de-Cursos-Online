import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await register({ fullName, email, password, role });
      navigate('/courses', { replace: true });
    } catch (apiError) {
      setError(apiError.message || 'No se pudo completar el registro');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-section">
      <Card className="auth-card" variant="elevated">
        <h1>Crear cuenta</h1>
        <p className="muted">Para MVP se permite registro de alumno o instructor.</p>
        <form onSubmit={handleSubmit} className="stack-md">
          <Input
            id="full-name"
            label="Nombre completo"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          <Input
            id="register-email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            id="register-password"
            label="Contrasena"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            hint="Minimo 8 caracteres"
          />
          <label className="field">
            <span className="field-label">Rol</span>
            <select value={role} onChange={(event) => setRole(event.target.value)} className="input">
              <option value="student">Alumno</option>
              <option value="instructor">Instructor</option>
            </select>
          </label>
          {error && <p className="error-text">{error}</p>}
          <Button type="submit" disabled={isSubmitting} fullWidth>
            {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
          </Button>
        </form>
        <p className="muted">
          Ya tenes cuenta? <Link to="/login">Ingresa</Link>
        </p>
      </Card>
    </section>
  );
}
