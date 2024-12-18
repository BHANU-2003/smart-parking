import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const createUser = async (username: string, email: string, password: string) => {
  const hashedPassword = await hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

export const validateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return null;

  const isValid = await compare(password, user.password);
  if (!isValid) return null;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  };
};

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};