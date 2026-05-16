import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export const authMiddleware = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
