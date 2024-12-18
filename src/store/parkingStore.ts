import { create } from 'zustand';
import { format, isAfter } from 'date-fns';
import toast from 'react-hot-toast';

interface ParkingSpot {
  id: string;
  isOccupied: boolean;
  price: number;
  vehicleDetails?: {
    name: string;
    email: string;
    phone: string;
    numberPlate: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
  };
}

interface ParkingStore {
  spots: ParkingSpot[];
  dailyRevenue: { [key: string]: number };
  addVehicle: (spotId: string, details: Omit<ParkingSpot['vehicleDetails'], 'totalAmount'>) => void;
  removeVehicle: (spotId: string) => void;
  extendTime: (spotId: string, newCheckOut: string) => void;
  calculatePrice: (checkIn: string, checkOut: string) => number;
  calculateRevenue: (date: string) => number;
  getAvailableSpots: () => ParkingSpot[];
  getReservedSpots: () => ParkingSpot[];
  checkTimeExpirations: () => void;
}

const HOURLY_RATE = 100; // ₹100 per hour
const EXTENSION_RATE = 150; // ₹150 per hour for extensions

const useParkingStore = create<ParkingStore>((set, get) => ({
  spots: Array.from({ length: 20 }, (_, i) => ({
    id: `SPOT-${String(i + 1).padStart(2, '0')}`,
    isOccupied: false,
    price: HOURLY_RATE,
  })),
  dailyRevenue: {},

  calculatePrice: (checkIn: string, checkOut: string) => {
    const hours = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60)
    );
    return hours * HOURLY_RATE;
  },

  addVehicle: (spotId, details) => {
    const totalAmount = get().calculatePrice(details.checkIn, details.checkOut);
    set((state) => ({
      spots: state.spots.map((spot) =>
        spot.id === spotId
          ? {
              ...spot,
              isOccupied: true,
              vehicleDetails: { ...details, totalAmount },
            }
          : spot
      ),
    }));
  },

  removeVehicle: (spotId) =>
    set((state) => ({
      spots: state.spots.map((spot) =>
        spot.id === spotId
          ? { ...spot, isOccupied: false, vehicleDetails: undefined }
          : spot
      ),
    })),

  extendTime: (spotId, newCheckOut) => {
    const spot = get().spots.find((s) => s.id === spotId);
    if (spot?.vehicleDetails) {
      const extensionHours = Math.ceil(
        (new Date(newCheckOut).getTime() - new Date(spot.vehicleDetails.checkOut).getTime()) /
          (1000 * 60 * 60)
      );
      const additionalAmount = extensionHours * EXTENSION_RATE;
      
      set((state) => ({
        spots: state.spots.map((s) =>
          s.id === spotId && s.vehicleDetails
            ? {
                ...s,
                vehicleDetails: {
                  ...s.vehicleDetails,
                  checkOut: newCheckOut,
                  totalAmount: s.vehicleDetails.totalAmount + additionalAmount,
                },
              }
            : s
        ),
      }));
    }
  },

  calculateRevenue: (date) => {
    const spots = get().spots;
    return spots.reduce((total, spot) => {
      if (spot.vehicleDetails) {
        const checkIn = new Date(spot.vehicleDetails.checkIn);
        if (format(checkIn, 'yyyy-MM-dd') === date) {
          return total + spot.vehicleDetails.totalAmount;
        }
      }
      return total;
    }, 0);
  },

  checkTimeExpirations: () => {
    const spots = get().spots;
    const now = new Date();
    
    spots.forEach((spot) => {
      if (spot.vehicleDetails) {
        const checkOut = new Date(spot.vehicleDetails.checkOut);
        if (isAfter(now, checkOut)) {
          toast.error(
            `Hello ${spot.vehicleDetails.name}, your parking time has expired. Please extend your reservation or vacate the spot.`,
            { duration: 5000 }
          );
        }
      }
    });
  },

  getAvailableSpots: () => get().spots.filter((spot) => !spot.isOccupied),
  getReservedSpots: () => get().spots.filter((spot) => spot.isOccupied),
}));

export default useParkingStore;