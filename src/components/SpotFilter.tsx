import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, AlertCircle } from 'lucide-react';
import useParkingStore from '../store/parkingStore';
import toast from 'react-hot-toast';

const SpotFilter = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<'available' | 'reserved'>(
    (searchParams.get('type') as 'available' | 'reserved') || 'available'
  );
  
  const { getAvailableSpots, getReservedSpots, extendTime } = useParkingStore();
  const spots = filter === 'available' ? getAvailableSpots() : getReservedSpots();

  const handleExtendTime = (spotId: string) => {
    const newCheckOut = new Date();
    newCheckOut.setHours(newCheckOut.getHours() + 1);
    extendTime(spotId, newCheckOut.toISOString());
    toast.success('Parking time extended successfully');
  };

  useEffect(() => {
    const type = searchParams.get('type') as 'available' | 'reserved';
    if (type) {
      setFilter(type);
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('available')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'available'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Available Spots ({getAvailableSpots().length})
        </button>
        <button
          onClick={() => setFilter('reserved')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'reserved'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Reserved Spots ({getReservedSpots().length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {spots.map((spot) => (
          <div
            key={spot.id}
            className={`p-6 rounded-lg ${
              spot.isOccupied ? 'bg-red-50' : 'bg-green-50'
            } hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{spot.id}</h3>
              {spot.isOccupied && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span>₹{spot.price}/hr</span>
                </div>
              )}
            </div>
            
            {spot.vehicleDetails && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <p><span className="font-medium">Owner:</span> {spot.vehicleDetails.name}</p>
                  <p><span className="font-medium">Email:</span> {spot.vehicleDetails.email}</p>
                  <p><span className="font-medium">Phone:</span> {spot.vehicleDetails.phone}</p>
                  <p><span className="font-medium">Vehicle:</span> {spot.vehicleDetails.numberPlate}</p>
                  <p><span className="font-medium">Check-in:</span> {new Date(spot.vehicleDetails.checkIn).toLocaleString()}</p>
                  <p><span className="font-medium">Check-out:</span> {new Date(spot.vehicleDetails.checkOut).toLocaleString()}</p>
                  <p><span className="font-medium">Total Amount:</span> ₹{spot.vehicleDetails.totalAmount}</p>
                </div>

                {new Date() > new Date(spot.vehicleDetails.checkOut) && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <p className="text-sm font-medium">Parking time has expired!</p>
                    </div>
                    <button
                      onClick={() => handleExtendTime(spot.id)}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Extend Time (₹150/hr)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotFilter;