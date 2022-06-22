import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // check if header carry valid authorization token
    if (request.headers.hasOwnProperty('authorization')) {
      // extract the Bearer token from header
      const bearerToken = request.headers['authorization'].split(' ');
      if (bearerToken.length !== 2)
        throw new BadRequestException('Invalid Bearer Token!');
      // verify the Bearer token
      if (bearerToken[0] === 'Bearer' && bearerToken[1] === 'cool') return true;
      else throw new UnauthorizedException('Invalid Bearer Token!');
    } else throw new UnauthorizedException('Bearer Token not exist!');
  }
}
