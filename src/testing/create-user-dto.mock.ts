import { Role } from '../enums/role.enum';
import { CreateUserDTO } from '../user/dto/create-user.dto';

export const createUserDTO: CreateUserDTO = {
  birthAt: '2002-02-04',
  email: 'josealv121@gmail.com',
  name: 'Jose Alves',
  password: 'Jp12345_',
  role: Role.User,
};
