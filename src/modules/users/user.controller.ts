import { Request, Response } from 'express';
import { createUser, listUsers } from './user.service';

export async function createUserController(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    const u = await createUser({ name, email, password, role });
    res.status(201).json(u);
  } catch (e:any) {
    res.status(400).json({ error: e.message });
  }
}

export async function listUsersController(_req: Request, res: Response) {
  const users = await listUsers();
  res.json(users);
}
