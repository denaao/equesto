import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { getMe } from './services/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Listings from './pages/Listings';
import ListingForm from './pages/ListingForm';
import Categories from './pages/Categories';
import Admins from './pages/Admins';
import Layout from './components/Layout';

// ---- Auth context ----
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('equesto_token');
    if (token) {
      getMe()
        .then(data => setAdmin(data.admin))
        .catch(() => localStorage.removeItem('equesto_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div style={styles.loading}>Carregando...</div>;

  return (
    <AuthContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

function PrivateRoute({ children }) {
  const { admin } = useAuth();
  return admin ? children : <Navigate to="/login" />;
}

const styles = {
  loading: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', color: '#1B4332', fontSize: 16,
  },
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/listings" element={
            <PrivateRoute>
              <Layout>
                <Listings />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/listings/new" element={
            <PrivateRoute>
              <Layout>
                <ListingForm />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/listings/:id" element={
            <PrivateRoute>
              <Layout>
                <ListingForm />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/categories" element={
            <PrivateRoute>
              <Layout>
                <Categories />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/admins" element={
            <PrivateRoute>
              <Layout