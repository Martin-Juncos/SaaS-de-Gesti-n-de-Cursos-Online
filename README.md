# SaaS de Gestion de Cursos Online

Aplicacion fullstack monolitica (sin microservicios) con:

- Backend: Node.js + Express + PostgreSQL
- Frontend: React + React Router + Vite
- Auth: JWT (HS256) + RBAC (`admin`, `instructor`, `student`)

## Estructura

```text
backend/
frontend/
```

## Funcionalidades implementadas

- Registro y login con JWT.
- Roles y control de acceso por middleware.
- Cursos: crear/listar/ver/editar/eliminar.
- Lecciones: crear/listar/editar/eliminar por curso.
- Inscripciones de alumnos a cursos publicados.
- Progreso por leccion con update idempotente.
- Dashboards:
  - Instructor: alumnos por curso.
  - Alumno: progreso por curso.
  - Admin: metricas globales.

## Backend

### 1) Configurar entorno

```bash
cd backend
cp .env.example .env
```

Completar al menos:

- `DATABASE_URL`
- `JWT_SECRET`

### 2) Instalar dependencias

```bash
npm install
```

### 3) Migrar base de datos

```bash
npm run migrate
```

### 4) Levantar API

```bash
npm run dev
```

API base: `http://localhost:4000/api`
Healthcheck: `http://localhost:4000/health`

## Frontend

### 1) Configurar entorno

```bash
cd frontend
cp .env.example .env
```

### 2) Instalar dependencias

```bash
npm install
```

### 3) Levantar UI

```bash
npm run dev
```

UI: `http://localhost:5173`

## Endpoints principales

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/courses`
- `POST /api/courses`
- `GET /api/courses/:courseId`
- `PATCH /api/courses/:courseId`
- `DELETE /api/courses/:courseId`
- `GET /api/courses/:courseId/lessons`
- `POST /api/courses/:courseId/lessons`
- `POST /api/courses/:courseId/enroll`
- `GET /api/enrollments/me`
- `POST /api/lessons/:lessonId/progress`
- `GET /api/courses/:courseId/progress/me`
- `GET /api/dashboard/instructor`
- `GET /api/dashboard/student`
- `GET /api/dashboard/admin`

## Notas de despliegue (Render o similar)

- Backend como Web Service con `npm start` en `backend`.
- Frontend como Static Site desde `frontend` (`npm run build`).
- PostgreSQL administrado.
- Variables de entorno cargadas desde panel del proveedor.
