import dotenv from 'dotenv';
dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
export const DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
