import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import useParkingStore from '../store/parkingStore';

const PaymentPage = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const { spots, removeVehicle } = useParkingStore();
  const [amount, setAmount] = useState('');

  const spot = spots.find(s => s.id === spotId);
  const totalAmount = spot?.vehicleDetails?.totalAmount || 0;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const paid = parseFloat(amount);

    if (paid < totalAmount) {
      const remaining = totalAmount - paid;
      toast.error(`Insufficient payment. Remaining balance: ₹${remaining.toFixed(2)}`);
      return;
    }

    if (spotId) {
      removeVehicle(spotId);
      toast.success(`Payment successful! Spot ${spotId} has been cleared.`);
      navigate('/');
    }
  };

  if (!spot?.vehicleDetails) {
    return <div>Spot not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-8">
          <CreditCard className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Payment Details</h1>
            <p className="text-gray-500 mt-1">Complete payment to exit parking</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-4">Billing Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Parking Duration</span>
                <span>{spot.vehicleDetails.duration}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Enter Payment Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
              required
              step="0.01"
              min="0"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>Pay Now</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;