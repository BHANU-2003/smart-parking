import React from 'react';
import { MapPin } from 'lucide-react';

const ParkingMap = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Find Parking Spot</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="aspect-video relative bg-gray-50 rounded-lg overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-4 gap-2 p-4">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className={`relative flex items-center justify-center ${
                  Math.random() > 0.3 ? 'bg-green-50' : 'bg-red-50'
                } rounded-lg border ${
                  Math.random() > 0.3 ? 'border-green-100' : 'border-red-100'
                }`}
              >
                <MapPin className={`w-5 h-5 ${
                  Math.random() > 0.3 ? 'text-green-500' : 'text-red-500'
                }`} />
                <span className="absolute bottom-1 text-xs font-medium">
                  {String.fromCharCode(65 + Math.floor(index / 5))}{index % 5 + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-semibold mb-4">Legend</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-50 border border-green-100 rounded"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-50 border border-red-100 rounded"></div>
              <span className="text-sm text-gray-600">Occupied</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Available Spots</p>
              <p className="text-2xl font-semibold text-green-600">14</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Occupied Spots</p>
              <p className="text-2xl font-semibold text-red-600">6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingMap;