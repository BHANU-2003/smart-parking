import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const Reservations = () => {
  const reservations = [
    {
      id: 1,
      spotNumber: 'A12',
      date: '2024-03-20',
      startTime: '14:00',
      duration: '2 hours',
      price: '$10.00',
      status: 'upcoming',
    },
    {
      id: 2,
      spotNumber: 'B05',
      date: '2024-03-19',
      startTime: '10:00',
      duration: '1 hour',
      price: '$5.00',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Reservations</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          New Reservation
        </button>
      </div>

      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Spot {reservation.spotNumber}</h3>
                    <p className="text-sm text-gray-500">{reservation.price}</p>
                  </div>
                </div>
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{reservation.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {reservation.startTime} ({reservation.duration})
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    reservation.status === 'upcoming'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-green-50 text-green-600'
                  }`}
                >
                  {reservation.status}
                </span>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;