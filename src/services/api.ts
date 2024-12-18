import { createUser, findUserByEmail, createParkingEntry, updateParkingSpot, deleteParkingEntry, getParkingSpots, getDailyRevenue } from './db';
import { hash, compare } from 'bcryptjs';

export const loginUser = async (email: string, password: string) => {
  const user = findUserByEmail.get(email);
  if (!user || !await compare(password, user.password)) {
    throw new Error('Invalid credentials');
  }
  return { id: user.id, username: user.username, email: user.email };
};

export const registerUser = async (username: string, email: string, password: string) => {
  const hashedPassword = await hash(password, 10);
  try {
    const result = createUser.run(username, email, hashedPassword);
    return { id: result.lastInsertRowid, username, email };
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

export const createParking = (data: any) => {
  const result = createParkingEntry.run(
    data.spotId,
    true,
    data.userId,
    data.vehicleNumber,
    data.checkIn,
    data.checkOut,
    data.amount
  );
  return result.changes > 0;
};

export const updateParking = (spotId: string, data: any) => {
  const result = updateParkingSpot.run(
    data.isOccupied,
    data.userId,
    data.vehicleNumber,
    data.checkIn,
    data.checkOut,
    data.amount,
    spotId
  );
  return result.changes > 0;
};

export const deleteParking = (spotId: string) => {
  const result = deleteParkingEntry.run(spotId);
  return result.changes > 0;
};

export const getAllParkingSpots = () => {
  return getParkingSpots.all();
};

export const getRevenue = (date: string) => {
  const result = getDailyRevenue.get(date);
  return result?.total || 0;
};