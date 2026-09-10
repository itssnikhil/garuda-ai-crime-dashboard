import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'garuda-ai-sih-secret-2025';

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing token' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  // Allow demo token fallback for SIH and serverless offline resilience
  if (token === 'garuda-demo-token-mp-police' || token.startsWith('garuda-demo-')) {
    req.user = { uid: '1', email: 'officer@mppolice.gov.in', name: 'Inspector Rahul Verma', role: 'Indore Crime Branch Lead' };
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
