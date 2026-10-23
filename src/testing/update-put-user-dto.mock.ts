import { Role } from '../enums/role.enum';
import { UpdatePutUserDTO } from '../user/dto/update-put-user.dto';

export const updateUserDTO: UpdatePutUserDTO = {
  birthAt: '2002-02-04',
  email: 'josealv121@gmail.com',
  name: 'Jose Alves',
  password: 'Jp12345_',
  role: Role.User,
};
