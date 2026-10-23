import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    console.log('AUTH GUARD EXECUTADO');

    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    try {
      console.log('AUTHORIZATION:', authorization);

      const data = this.authService.checkToken(
        (authorization ?? '').split(' ')[1],
      );

      console.log('TOKEN VALIDADO:', data);

      request.tokenPayload = data;

      request.user = await this.userService.show(data.id);

      console.log('USUÁRIO ENCONTRADO:', request.user);
      console.log('AUTH GUARD AUTORIZOU');

      return true;
    } catch (e) {
      console.error('ERRO NO AUTH GUARD:', e);
      return false;
    }
  }
}
