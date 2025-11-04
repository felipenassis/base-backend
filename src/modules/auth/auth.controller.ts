import { Request, Response } from 'express';
import { login, refreshToken, logout } from './auth.service';

export async function loginController(req: Request, res: Response) {
  try { const r = await login(req.body.email, req.body.password); res.json(r); }
  catch(e:any){ res.status(401).json({error:e.message}); }
}
export async function refreshController(req: Request, res: Response) {
  try { const r = await refreshToken(req.body.refreshToken); res.json(r); }
  catch(e:any){ res.status(401).json({error:e.message}); }
}
export async function logoutController(req: Request, res: Response) {
  try { const r = await logout(req.body.refreshToken); res.json(r); }
  catch(e:any){ res.status(400).json({error:e.message}); }
}
