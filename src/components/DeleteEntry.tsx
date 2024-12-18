import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useParkingStore from '../store/parkingStore';

const DeleteEntry = () => {
  const { removeVehicle, getReservedSpots } = useParkingStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberPlate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reservedSpots = getReservedSpots();
    const spot = reservedSpots.find(
      spot => 
        spot.vehicleDetails?.name === formData.name &&
        spot.vehicleDetails?.email === formData.email &&
        spot.vehicleDetails?.phone === formData.phone &&
        spot.vehicleDetails?.numberPlate === formData.numberPlate
    );

    if (!spot) {
      toast.error('No matching vehicle found');
      return;
    }

    removeVehicle(spot.id);
    setFormData({
      name: '',
      email: '',
      phone: '',
      numberPlate: '',
    });
    
    toast.success(`Vehicle removed from spot ${spot.id}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-8">
          <Trash2 className="w-8 h-8 text-red-600" />
          <div>
            <h1 className="text-2xl font-bold">Delete Parking Entry</h1>
            <p className="text-gray-500 mt-1">Enter vehicle details to remove from parking</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Number Plate
              </label>
              <input
                type="text"
                name="numberPlate"
                value={formData.numberPlate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Remove Vehicle</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteEntry;