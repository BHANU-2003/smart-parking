import React, { useState } from 'react';
import { Car, Clock, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import useParkingStore from '../store/parkingStore';

const NewEntry = () => {
  const { addVehicle, getAvailableSpots, calculatePrice } = useParkingStore();
  const availableSpots = getAvailableSpots();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberPlate: '',
    checkIn: '',
    checkOut: '',
  });

  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (availableSpots.length === 0) {
      toast.error('No spots available');
      return;
    }

    const spotId = availableSpots[0].id;
    addVehicle(spotId, formData);
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      numberPlate: '',
      checkIn: '',
      checkOut: '',
    });
    setEstimatedPrice(null);
    
    toast.success('Entry added successfully');
  };

  const handleTimeChange = () => {
    if (formData.checkIn && formData.checkOut) {
      const price = calculatePrice(formData.checkIn, formData.checkOut);
      setEstimatedPrice(price);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'checkIn' || e.target.name === 'checkOut') {
      handleTimeChange();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-8">
          <Car className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">New Parking Entry</h1>
            <p className="text-gray-500 mt-1">Fill in the details to reserve a parking spot</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Check-in Time
              </label>
              <input
                type="datetime-local"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Expected Check-out Time
              </label>
              <input
                type="datetime-local"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {estimatedPrice !== null && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium">Estimated Price:</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium">₹{estimatedPrice}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Car className="w-5 h-5" />
            <span>Reserve Spot</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewEntry;