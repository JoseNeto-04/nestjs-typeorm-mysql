import { Role } from '../enums/role.enum';
import { UserEntity } from '../user/entity/user.entity';

export const userEntityList: UserEntity[] = [
  {
    birthAt: new Date('2002-02-04'),
    email: 'josealv121@gmail.com',
    id: 1,
    password: '$2b$10$VxBM/c/VlxPVO5jHTPOx9eQkOPA1vZ1tVAp72wUNZOPoKRXcc2nK.',
    name: 'Jose Neto',
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    birthAt: new Date('2002-02-04'),
    email: 'lucasS23@gmail.com',
    id: 2,
    password: '$2b$10$VxBM/c/VlxPVO5jHTPOx9eQkOPA1vZ1tVAp72wUNZOPoKRXcc2nK.',
    name: 'Lucas Santos',
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    birthAt: new Date('2002-02-04'),
    email: 'gustavoH33@gmail.com',
    id: 3,
    password: '$2b$10$VxBM/c/VlxPVO5jHTPOx9eQkOPA1vZ1tVAp72wUNZOPoKRXcc2nK.',
    name: 'Gustavo Henrique',
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
