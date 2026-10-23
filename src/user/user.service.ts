import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private UserRepository: Repository<UserEntity>,
  ) {}

  async create(data: CreateUserDTO) {
    if (
      await this.UserRepository.exist({
        where: {
          email: data.email,
        },
      })
    ) {
      throw new BadRequestException('Este e-mail ja esta sendo usado!');
    }

    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

    const user = this.UserRepository.create(data);

    return await this.UserRepository.save(user);
  }

  async list() {
    return this.UserRepository.find();
  }

  async show(id: number) {
    await this.exists(id);

    return this.UserRepository.findOneBy({
      id,
    });
  }

  async update(id: number, data: UpdatePutUserDTO) {
    await this.exists(id);

    const salt = await bcrypt.genSalt();

    const password = await bcrypt.hash(data.password, salt);

    await this.UserRepository.update(id, {
      name: data.name,
      email: data.email,
      password,
      birthAt: data.birthAt ? new Date(data.birthAt) : null,
      role: data.role,
    });

    return this.show(id);
  }

  async updatePartial(id: number, data: UpdatePatchUserDTO) {
    await this.exists(id);

    if (data.password !== undefined) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }

    await this.UserRepository.update(id, data);

    return this.show(id);
  }

  async delete(id: number) {
    await this.exists(id);

    await this.UserRepository.delete(id);

    return true;
  }

  async exists(id: number) {
    if (
      !(await this.UserRepository.exist({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`O usuario ${id} nao existe.`);
    }
  }
}
