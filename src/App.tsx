import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import NewEntry from './components/NewEntry';
import DeleteEntry from './components/DeleteEntry';
import SpotFilter from './components/SpotFilter';
import RevenueTracker from './components/RevenueTracker';
import UserManagement from './components/UserManagement';
import Login from './components/Login';
import PaymentPage from './components/PaymentPage';
import useAuthStore from './store/authStore';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        {isAuthenticated && <Navbar isAdmin={user?.isAdmin} />}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route
              path="/"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/new-entry"
              element={isAuthenticated ? <NewEntry /> : <Navigate to="/login" />}
            />
            <Route
              path="/delete-entry"
              element={isAuthenticated && user?.isAdmin ? <DeleteEntry /> : <Navigate to="/" />}
            />
            <Route
              path="/filter"
              element={isAuthenticated ? <SpotFilter /> : <Navigate to="/login" />}
            />
            <Route
              path="/revenue"
              element={isAuthenticated && user?.isAdmin ? <RevenueTracker /> : <Navigate to="/" />}
            />
            <Route
              path="/users"
              element={isAuthenticated && user?.isAdmin ? <UserManagement /> : <Navigate to="/" />}
            />
            <Route
              path="/payment/:spotId"
              element={isAuthenticated ? <PaymentPage /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;