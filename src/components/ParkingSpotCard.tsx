import React from 'react';
import { Check, Clock, X } from 'lucide-react';

interface ParkingSpotCardProps {
  spotNumber: string;
  status: 'available' | 'occupied' | 'reserved';
  duration: string;
  price: string;
}

const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({
  spotNumber,
  status,
  duration,
  price,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return 'bg-green-50 text-green-600';
      case 'occupied':
        return 'bg-red-50 text-red-600';
      case 'reserved':
        return 'bg-yellow-50 text-yellow-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'available':
        return <Check className="w-4 h-4" />;
      case 'occupied':
        return <X className="w-4 h-4" />;
      case 'reserved':
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <span className="font-semibold text-blue-600">{spotNumber}</span>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-sm capitalize ${getStatusColor()}`}>
              {status}
            </span>
            <span className="text-gray-500">{duration}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{price}</p>
        </div>
      </div>
      <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
        Details
      </button>
    </div>
  );
};

export default ParkingSpotCard;