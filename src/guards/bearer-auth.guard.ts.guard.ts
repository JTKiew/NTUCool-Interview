import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class BearerAuthGuard implements CanActivate{
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // check if header carry valid authorization token
    if (request.headers.hasOwnProperty('authorization')){
      // extract the Bearer token from header 
      const BearerToken = request.headers["authorization"].split(' ');
      if (BearerToken.length != 2) throw new BadRequestException("Invalid Bearer Token!")
      // verify the Bearer token 
      if (BearerToken[0] === "Bearer" && BearerToken[1] === "cool") return true
      else throw new UnauthorizedException("Invalid Bearer Token!");
    }
    else throw new UnauthorizedException("Bearer Token not exist!");
  }
}