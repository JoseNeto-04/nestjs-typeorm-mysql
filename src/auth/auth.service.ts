import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  private readonly issuer = 'VonexXT';
  private readonly audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,

    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
  ) {}

  createToken(user: UserEntity) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '5d',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });
    } catch (e) {
      throw new BadRequestException('Token invalido!', {
        cause: e,
      });
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.UserRepository.findOneBy({
      email,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('E-mail e/ou senha incorreto.');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.UserRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new UnauthorizedException('E-mail esta incorreto');
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '30m',
        subject: String(user.id),
        issuer: 'forget',
        audience: this.audience,
      },
    );

    await this.mailer.sendMail({
      subject: 'Recuperacao de senha',
      to: user.email,
      template: 'forget',
      context: {
        name: user.name,
        token,
      },
    });

    return { success: true };
  }

  async reset(password: string, token: string) {
    let data: { id: number };

    try {
      data = this.jwtService.verify(token, {
        issuer: 'forget',
        audience: this.audience,
      });
    } catch {
      throw new BadRequestException(
        'Token de recuperacao invalido ou expirado!',
      );
    }

    const id = Number(data.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Token invalido!');
    }

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await this.UserRepository.update(id, {
        password: hashedPassword,
      });

      if (!result.affected) {
        throw new BadRequestException('Usuario nao encontrado!');
      }

      const user = await this.userService.show(id);

      return this.createToken(user);
    } catch (e) {
      console.error('ERRO ORIGINAL DO RESET:', e);

      throw new BadRequestException('Nao foi possivel redefinir a senha!', {
        cause: e,
      });
    }
  }
  async register(data: AuthRegisterDTO) {
    delete data.role;

    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
