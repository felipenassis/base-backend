import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';
import { userRouter } from './modules/users/user.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.get('/', (_,res)=>res.json({ ok: true }));

export default app;
