// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; // <-- Import ThemeProvider kita

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DashboardLayout from './components/DashboardLayout';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('user_is_logged_in') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    // Bungkus semua dengan ThemeProvider
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}