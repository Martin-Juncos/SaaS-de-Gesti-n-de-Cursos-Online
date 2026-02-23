import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesService, dashboardService } from '../api/services';
import { useAuth } from '../hooks/useAuth';

const ROLE_LABEL = {
  admin: 'Admin',
  instructor: 'Instructor',
  student: 'Student'
};

const FALLBACK_BY_ROLE = {
  admin: {
    kpis: {
      activeCourses: 0,
      averageProgress: 68,
      enrolledStudents: 0,
      completedLessons: 3200
    },
    recentActivity: [
      { id: 'adm-1', time: '09:12', label: 'Nuevo instructor aprobado' },
      { id: 'adm-2', time: '10:08', label: 'Pico de inscripciones detectado' },
      { id: 'adm-3', time: '11:20', label: 'Revision de metricas semanal completada' }
    ]
  },
  instructor: {
    kpis: {
      activeCourses: 0,
      averageProgress: 72,
      enrolledStudents: 0,
      completedLessons: 860
    },
    recentActivity: [
      { id: 'ins-1', time: '08:47', label: 'Publicaste una nueva leccion' },
      { id: 'ins-2', time: '10:26', label: 'Recibiste 12 nuevas inscripciones' },
      { id: 'ins-3', time: '13:14', label: '2 alumnos completaron el modulo 3' }
    ]
  },
  student: {
    kpis: {
      activeCourses: 0,
      averageProgress: 0,
      enrolledStudents: 0,
      completedLessons: 0
    },
    recentActivity: [
      { id: 'stu-1', time: '07:35', label: 'Completaste una leccion' },
      { id: 'stu-2', time: '12:15', label: 'Nuevo material disponible en un curso' },
      { id: 'stu-3', time: '18:03', label: 'Recibiste recordatorio de progreso' }
    ]
  }
};

const QUICK_ACTIONS = {
  admin: [
    { id: 'qa-a-1', label: 'Crear curso', to: '/courses' },
    { id: 'qa-a-2', label: 'Ver cursos', to: '/courses' },
    { id: 'qa-a-3', label: 'Revisar metricas', to: '/dashboard/admin' },
    { id: 'qa-a-4', label: 'Gestionar plataforma', to: '/dashboard/admin' }
  ],
  instructor: [
    { id: 'qa-i-1', label: 'Crear curso', to: '/courses' },
    { id: 'qa-i-2', label: 'Ver mis cursos', to: '/courses' },
    { id: 'qa-i-3', label: 'Revisar metricas', to: '/dashboard/instructor' },
    { id: 'qa-i-4', label: 'Gestionar contenido', to: '/dashboard/instructor' }
  ],
  student: [
    { id: 'qa-s-1', label: 'Inscribirme', to: '/courses' },
    { id: 'qa-s-2', label: 'Ver mis cursos', to: '/dashboard/student' },
    { id: 'qa-s-3', label: 'Revisar metricas', to: '/dashboard/student' },
    { id: 'qa-s-4', label: 'Retomar aprendizaje', to: '/dashboard/student' }
  ]
};

function buildKpis({ role, dashboard, courses }) {
  const base = { ...FALLBACK_BY_ROLE[role].kpis };

  if (role === 'admin') {
    return {
      ...base,
      activeCourses: dashboard?.totalCourses ?? base.activeCourses,
      enrolledStudents: dashboard?.totalEnrollments ?? base.enrolledStudents
    };
  }

  if (role === 'instructor') {
    const publishedCourses =
      dashboard?.courses?.filter((course) => Boolean(course.isPublished)).length ?? 0;
    const averageProgress = dashboard?.totalCourses
      ? Math.round((publishedCourses / dashboard.totalCourses) * 100)
      : base.averageProgress;

    return {
      ...base,
      activeCourses: dashboard?.totalCourses ?? base.activeCourses,
      averageProgress,
      enrolledStudents: dashboard?.totalStudents ?? base.enrolledStudents
    };
  }

  const completedLessons =
    dashboard?.courses?.reduce((acc, course) => acc + (course.completedLessons || 0), 0) ?? 0;

  return {
    ...base,
    activeCourses: dashboard?.totalEnrollments ?? base.activeCourses,
    averageProgress: dashboard?.averageProgress ?? base.averageProgress,
    enrolledStudents: dashboard?.totalEnrollments ?? base.enrolledStudents,
    completedLessons
  };
}

function buildRecentCourses({ role, dashboard, courses }) {
  if (role === 'instructor') {
    return (dashboard?.courses || []).slice(0, 5).map((course) => ({
      id: `ins-${course.courseId}`,
      title: course.title,
      owner: 'Tu equipo',
      lessons: '-',
      status: course.isPublished ? 'Publicado' : 'Borrador'
    }));
  }

  if (role === 'student') {
    return (dashboard?.courses || []).slice(0, 5).map((course) => ({
      id: `stu-${course.courseId}`,
      title: course.title,
      owner: course.instructorName || 'Instructor',
      lessons: course.totalLessons ?? '-',
      status: `${course.progressPercent || 0}% progreso`
    }));
  }

  return (courses || []).slice(0, 5).map((course) => ({
    id: `adm-${course.id}`,
    title: course.title,
    owner: course.instructorName || 'Instructor',
    lessons: course.enrolledStudents ?? '-',
    status: course.isPublished ? 'Publicado' : 'Borrador'
  }));
}

function KpiCard({ label, value, suffix = '' }) {
  return (
    <article className="group rounded-2xl border border-teal-200/25 bg-slate-900/55 p-4 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-teal-200/55 hover:bg-teal-500/15">
      <p className="text-xs uppercase tracking-wider text-teal-100/70">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-teal-50">
        {value}
        {suffix}
      </p>
    </article>
  );
}

function QuickAction({ action }) {
  return (
    <Link
      to={action.to}
      className="group inline-flex items-center justify-between rounded-xl border border-teal-100/35 bg-teal-400/10 px-4 py-3 text-sm font-semibold text-teal-50 transition-all duration-500 hover:scale-105 hover:border-teal-50/70 hover:bg-teal-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      {action.label}
      <span className="text-teal-100/70 transition-all duration-500 group-hover:translate-x-1">{'->'}</span>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-teal-200/25 bg-teal-500/10 p-8 text-center backdrop-blur-md">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-teal-300/30 to-cyan-300/20 ring-1 ring-teal-200/40" />
      <h3 className="text-lg font-extrabold text-teal-50">No hay cursos recientes todavia</h3>
      <p className="mt-2 text-sm text-teal-100/75">
        Empieza creando o explorando cursos para llenar este dashboard.
      </p>
      <Link
        to="/courses"
        className="mt-5 inline-flex items-center justify-center rounded-xl border border-teal-100/40 bg-teal-400/15 px-4 py-2 text-sm font-semibold text-teal-50 transition-all duration-500 hover:scale-105 hover:bg-teal-300/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      >
        Explorar cursos
      </Link>
    </div>
  );
}

export default function DashboardHomePage() {
  const { token, user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [courses, setCourses] = useState([]);

  const role = user?.role || 'student';

  useEffect(() => {
    let cancelled = false;

    async function loadDashboardHome() {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        /*
          API connections:
          - GET /api/auth/me is already resolved by AuthContext (useAuth user).
          - GET /api/dashboard/admin | /api/dashboard/instructor | /api/dashboard/student.
          - GET /api/courses.
        */
        const dashboardPromise =
          role === 'admin'
            ? dashboardService.admin(token)
            : role === 'instructor'
              ? dashboardService.instructor(token)
              : dashboardService.student(token);

        const coursesPromise = coursesService.list({
          token: token || undefined,
          mine: role === 'instructor'
        });

        const [dashboardData, coursesData] = await Promise.all([dashboardPromise, coursesPromise]);

        if (cancelled) return;
        setDashboard(dashboardData || null);
        setCourses(coursesData?.courses || []);
      } catch (apiError) {
        if (cancelled) return;
        setError(apiError.message || 'No se pudo cargar el dashboard principal');
        setDashboard(null);
        setCourses([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardHome();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, role, token]);

  const kpis = useMemo(
    () =>
      buildKpis({
        role,
        dashboard,
        courses
      }),
    [role, dashboard, courses]
  );

  const recentCourses = useMemo(
    () =>
      buildRecentCourses({
        role,
        dashboard,
        courses
      }),
    [role, dashboard, courses]
  );

  const recentActivity = dashboard?.recentActivity || FALLBACK_BY_ROLE[role].recentActivity;

  if (isLoading) {
    return (
      <section className="space-y-6 rounded-3xl border border-teal-200/20 bg-slate-950/70 p-6 backdrop-blur-md">
        <div className="h-7 w-56 animate-pulse rounded bg-teal-300/20" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`skeleton-kpi-${index + 1}`} className="h-24 animate-pulse rounded-xl bg-teal-300/10" />
          ))}
        </div>
        <div className="h-56 animate-pulse rounded-xl bg-teal-300/10" />
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute right-0 top-16 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-teal-200/25 bg-slate-900/55 p-5 backdrop-blur-md md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-teal-100/70">Dashboard principal</p>
            <h1 className="text-2xl font-extrabold text-teal-50 sm:text-3xl">
              Hola, {user?.fullName || 'Usuario'}
            </h1>
            <p className="mt-1 text-sm text-teal-100/75">Rol actual: {ROLE_LABEL[role] || 'Student'}</p>
          </div>
          <div className="inline-flex items-center rounded-xl border border-teal-100/35 bg-teal-300/10 px-3 py-1 text-sm font-semibold text-teal-50">
            Sentient UX / Transformative Teal
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-amber-300/45 bg-amber-200/15 px-4 py-3 text-sm text-amber-100">
            {error}. Mostrando estado de respaldo.
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Indicadores clave">
          <KpiCard label="Cursos activos" value={kpis.activeCourses} />
          <KpiCard label="Progreso promedio" value={kpis.averageProgress} suffix="%" />
          <KpiCard
            label={role === 'student' ? 'Cursos inscritos' : 'Alumnos inscritos'}
            value={kpis.enrolledStudents}
          />
          <KpiCard label="Lecciones completadas" value={kpis.completedLessons} />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-teal-200/20 bg-slate-900/55 p-5 backdrop-blur-md lg:col-span-2">
            <h2 className="text-lg font-extrabold text-teal-50">Acciones rapidas</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {QUICK_ACTIONS[role].map((action) => (
                <QuickAction key={action.id} action={action} />
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-teal-200/20 bg-slate-900/55 p-5 backdrop-blur-md">
            <h2 className="text-lg font-extrabold text-teal-50">Actividad reciente</h2>
            <ul className="mt-4 space-y-3">
              {recentActivity.map((activity) => (
                <li
                  key={activity.id}
                  className="rounded-xl border border-teal-200/20 bg-slate-800/70 px-3 py-2 transition-all duration-500 hover:border-teal-200/45"
                >
                  <p className="text-xs text-teal-100/65">{activity.time}</p>
                  <p className="text-sm text-teal-50">{activity.label}</p>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <article className="rounded-2xl border border-teal-200/20 bg-slate-900/55 p-5 backdrop-blur-md xl:col-span-2">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold text-teal-50">Cursos recientes</h2>
              <Link
                to="/courses"
                className="rounded-lg border border-teal-100/35 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-50 transition-all duration-500 hover:scale-105 hover:bg-teal-300/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Ver todos
              </Link>
            </div>

            {recentCourses.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                  <thead>
                    <tr className="text-teal-100/75">
                      <th className="px-3 py-2 font-semibold">Curso</th>
                      <th className="px-3 py-2 font-semibold">Autor</th>
                      <th className="px-3 py-2 font-semibold">
                        {role === 'admin' ? 'Inscritos' : 'Lecciones'}
                      </th>
                      <th className="px-3 py-2 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCourses.map((course) => (
                      <tr
                        key={course.id}
                        className="rounded-xl border border-teal-200/20 bg-slate-800/70 transition-all duration-500 hover:scale-[1.01] hover:border-teal-200/45"
                      >
                        <td className="rounded-l-xl px-3 py-3 text-teal-50">{course.title}</td>
                        <td className="px-3 py-3 text-teal-100/85">{course.owner}</td>
                        <td className="px-3 py-3 text-teal-100/85">{course.lessons}</td>
                        <td className="rounded-r-xl px-3 py-3 text-teal-100/90">{course.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-teal-200/20 bg-slate-900/55 p-5 backdrop-blur-md">
            <h2 className="text-lg font-extrabold text-teal-50">Progreso</h2>
            <p className="mt-1 text-sm text-teal-100/75">Resumen de avance reciente</p>
            <div className="mt-4 space-y-4">
              {recentCourses.slice(0, 4).map((course, index) => {
                const fallback = 30 + index * 15;
                const fromStatus = Number.parseInt(course.status, 10);
                const percent = Number.isNaN(fromStatus) ? fallback : fromStatus;

                return (
                  <div key={`progress-${course.id}`}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm text-teal-50">{course.title}</span>
                      <span className="text-xs text-teal-100/80">{percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 transition-all duration-500"
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {recentCourses.length === 0 && (
                <p className="text-sm text-teal-100/70">Sin datos de progreso para mostrar.</p>
              )}
            </div>
          </article>
        </section>
      </div>
    </section>
  );
}
