import { prisma } from '../../database/prisma';
import bcrypt from 'bcryptjs';

export async function createUser(data:{name:string,email:string,password:string,role?:string}){
  const role = await prisma.role.findUnique({where:{name:data.role||'user'}});
  if(!role) throw new Error('Role não encontrada');
  const hashed = await bcrypt.hash(data.password,8);
  return prisma.user.create({data:{name:data.name,email:data.email,password:hashed,roleId:role.id}, select:{id:true,name:true,email:true,role:true}});
}
export async function listUsers(){
  return prisma.user.findMany({include:{role:{include:{permissions:true}}}});
}
