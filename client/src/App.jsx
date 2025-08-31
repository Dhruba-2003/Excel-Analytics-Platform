import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/dashboardpage';
import LoginPage from './pages/loginpage';
import RegisterPage from './pages/registerpage';
import AdminPage from './pages/adminpage';
import HistoryPage from './pages/historypage';
import ProfilePage from './pages/profilepage';
import UserEditPage from './pages/usereditpage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard/:fileId" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin/user/:id/edit" element={<UserEditPage />} />
    </Routes>
  );
}
export default App;