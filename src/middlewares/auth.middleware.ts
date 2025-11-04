import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export function ensureAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = String(req.headers.authorization || '');
  if (!authHeader) return res.status(401).json({ error: 'Token ausente' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Token inválido' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = { id: decoded.id, role: decoded.role, permissions: decoded.permissions || [] };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
