import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="stack-md">
      <h1>Página no encontrada</h1>
      <p className="muted">La ruta que intentaste abrir no existe.</p>
      <Link to="/courses">Ir a cursos</Link>
    </section>
  );
}
