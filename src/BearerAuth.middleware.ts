import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class BearerTokenCheckMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        // check if header carry valid authorization token
        if (req.headers.hasOwnProperty('authorization')){
            // extract the Bearer token from header 
            const BearerToken = req.headers["authorization"].split(' ');
            // verify the Bearer token 
            if (BearerToken[0] !== 'Bearer' || BearerToken[1] !== 'cool')
                throw new UnauthorizedException();
        }
        else{
            throw new UnauthorizedException();
        }
    next();
    }
}