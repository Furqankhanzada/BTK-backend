import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/users.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(emailOrNumber: string, password: string): Promise<User> {
        const user = await this.authService.validateUser({ emailOrNumber, password });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
