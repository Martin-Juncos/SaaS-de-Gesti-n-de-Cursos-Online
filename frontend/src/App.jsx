import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import InstructorDashboardPage from './pages/InstructorDashboardPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DashboardHomePage from './pages/DashboardHomePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/courses" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />

        <Route element={<ProtectedRoute roles={['student', 'instructor', 'admin']} />}>
          <Route path="/dashboard/home" element={<DashboardHomePage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['student']} />}>
          <Route path="/dashboard/student" element={<StudentDashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['instructor', 'admin']} />}>
          <Route path="/dashboard/instructor" element={<InstructorDashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
