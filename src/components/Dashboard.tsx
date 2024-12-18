import React from 'react';
import { Car, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import useParkingStore from '../store/parkingStore';

const Dashboard = () => {
  const { getAvailableSpots, getReservedSpots } = useParkingStore();
  const availableSpots = getAvailableSpots();
  const reservedSpots = getReservedSpots();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/filter?type=available"
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-blue-200 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <Car className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Spots</p>
              <p className="text-2xl font-semibold text-green-600">{availableSpots.length}</p>
            </div>
          </div>
        </Link>
        
        <Link
          to="/filter?type=reserved"
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-blue-200 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-red-50 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Reserved Spots</p>
              <p className="text-2xl font-semibold text-red-600">{reservedSpots.length}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;