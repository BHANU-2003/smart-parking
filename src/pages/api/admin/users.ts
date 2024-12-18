import prisma from '../../../server/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          isAdmin: true,
        },
        where: {
          isAdmin: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { userId } = req.query;
      await prisma.user.delete({
        where: {
          id: Number(userId),
        },
      });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete user' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}