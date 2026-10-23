import { Test, TestingModule } from '@nestjs/testing';
import { mailerServiceMock } from '../testing/mailer-service.mock';
import { userRepositoryMock } from '../testing/user- repository.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { userServiceMock } from '../testing/user-service.mock';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { authRegisterDTO } from '../testing/auth-register-dto.mock';

let authService: AuthService;
let jwtService: JwtService;
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      JwtModule.register({
        secret:
          '3cc50ea797023497a8911f0d6b36694a4fbe7d875636cb20cc9e432783bdcff1',
        signOptions: {
          expiresIn: '1h',
        },
      }),
    ],

    providers: [
      AuthService,
      userRepositoryMock,
      userServiceMock,
      mailerServiceMock,
    ],
  }).compile();

  authService = module.get<AuthService>(AuthService);
  jwtService = module.get<JwtService>(JwtService);
});

test('Validar a definicao', () => {
  expect(authService).toBeDefined();
});

describe('Token', () => {
  test('createToken method', () => {
    const result = authService.createToken(userEntityList[0]);

    expect(result).toHaveProperty('accessToken');
    expect(typeof result.accessToken).toBe('string');
    expect(result.accessToken.length).toBeGreaterThan(0);
  });

  test('checkToken method', () => {
    const token = authService.createToken(userEntityList[0]).accessToken;

    const result = authService.checkToken(token);

    expect(result.id).toEqual(userEntityList[0].id);
  });

  test('isValidToken method', () => {
    const token = authService.createToken(userEntityList[0]).accessToken;

    const result = authService.isValidToken(token);

    expect(result).toBe(true);
  });
});

describe('Autenticacao', () => {
  test('login method', async () => {
    const result = await authService.login('josealv121@gmail.com', 'Jn123456_');

    expect(result).toHaveProperty('accessToken');

    const payload = authService.checkToken(result.accessToken);

    expect(payload.id).toBe(userEntityList[0].id);
  });

  test('reset method', async () => {
    const token = jwtService.sign(
      { id: userEntityList[0].id },
      {
        issuer: 'forget',
        audience: 'users',
        expiresIn: '30m',
      },
    );

    const result = await authService.reset('Jm123456_', token);

    expect(result).toHaveProperty('accessToken');
    expect(typeof result.accessToken).toBe('string');
  });
  test('forget method', async () => {
    const email = userEntityList[0].email;

    const result = await authService.forget(email);

    expect(result).toEqual({ success: true });

    expect(userRepositoryMock.useValue.findOneBy).toHaveBeenCalledWith({
      email,
    });

    expect(mailerServiceMock.useValue.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: email,
        subject: 'Recuperacao de senha',
        template: 'forget',
      }),
    );
  });
  test('register method', async () => {
    const result = await authService.register(authRegisterDTO);

    expect(result).toHaveProperty('accessToken');

    expect(typeof result.accessToken).toBe('string');

    expect(result.accessToken.length).toBeGreaterThan(0);
  });
});
