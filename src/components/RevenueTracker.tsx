import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import useParkingStore from '../store/parkingStore';

const RevenueTracker = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const { calculateRevenue } = useParkingStore();

  const revenue = calculateRevenue(selectedDate);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Daily Revenue</h2>
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600">₹{revenue.toFixed(2)}</p>
          <p className="text-gray-500 mt-2">Total Revenue for {selectedDate}</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueTracker;