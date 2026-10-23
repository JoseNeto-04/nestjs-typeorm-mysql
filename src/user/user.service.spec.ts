import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { updatePatchUserDTO } from '../testing/update-patch-user-dto.mock';
import { updateUserDTO } from '../testing/update-put-user-dto.mock';
import { userRepositoryMock } from '../testing/user- repository.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userReporsitory: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, userRepositoryMock],
    }).compile();

    userService = module.get<UserService>(UserService);
    userReporsitory = module.get(getRepositoryToken(UserEntity));
  });

  test('Validar a definicao', () => {
    expect(userService).toBeDefined();
    expect(userReporsitory).toBeDefined();
  });

  describe('Create', () => {
    test('method create', async () => {
      jest.spyOn(userReporsitory, 'exist').mockResolvedValueOnce(false);

      const result = await userService.create(createUserDTO);

      expect(result).toEqual(userEntityList[0]);
    });
  });
  describe('Read', () => {
    test('Validar a definicao', () => {
      expect(userService).toBeDefined();
    });
  });

  describe('Read', () => {
    test('method list', async () => {
      const result = await userService.list();

      expect(result).toEqual(userEntityList);
    });
    test('method show', async () => {
      const result = await userService.show(1);

      expect(result).toEqual(userEntityList[0]);
    });
  });
  describe('Update', () => {
    test('method update', async () => {
      const result = await userService.update(1, updateUserDTO);

      expect(result).toEqual(userEntityList[0]);
    });
    test('method updatePartial', async () => {
      const result = await userService.updatePartial(1, updatePatchUserDTO);

      expect(result).toEqual(userEntityList[0]);
    });
  });
  describe('Delete', () => {
    test('method delete', async () => {
      const result = await userService.delete(1);

      expect(result).toEqual(true);
    });
  });
});
