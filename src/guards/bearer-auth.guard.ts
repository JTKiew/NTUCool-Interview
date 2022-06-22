import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from 'src/roles/role';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request.headers.hasOwnProperty('authorization')) {
      const bearerToken = request.headers['authorization'].split(' ');
      if (bearerToken.length !== 2)
        throw new BadRequestException('Invalid Bearer Token!');

      if (bearerToken[0] === 'Bearer' && bearerToken[1] === 'cool') {
        // attach user's role to HttpRequest
        request.user = { roles: Role.Admin };
        return true;
      } else throw new UnauthorizedException('Invalid Bearer Token!');
    } else throw new UnauthorizedException('Bearer Token not exist!');
  }
}
