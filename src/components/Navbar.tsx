import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Filter, CreditCard, Plus, Trash2, Users, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = ({ isAdmin }: { isAdmin: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-xl">SmartPark</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg flex items-center space-x-1 ${isActive('/')}`}
            >
              <Car className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/filter"
              className={`px-3 py-2 rounded-lg flex items-center space-x-1 ${isActive('/filter')}`}
            >
              <Filter className="w-5 h-5" />
              <span>Spots</span>
            </Link>
            
            {isAdmin && (
              <>
                <Link
                  to="/revenue"
                  className={`px-3 py-2 rounded-lg flex items-center space-x-1 ${isActive('/revenue')}`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Revenue</span>
                </Link>

                <Link
                  to="/users"
                  className={`px-3 py-2 rounded-lg flex items-center space-x-1 ${isActive('/users')}`}
                >
                  <Users className="w-5 h-5" />
                  <span>Users</span>
                </Link>
              </>
            )}

            <Link
              to="/new-entry"
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Entry</span>
            </Link>

            {isAdmin && (
              <Link
                to="/delete-entry"
                className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Entry</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;