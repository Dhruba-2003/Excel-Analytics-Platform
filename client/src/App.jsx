import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <Routes>
      <Route path="/dashboard/:fileId" element={<DashboardPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    </Routes>
  );
}
export default App;