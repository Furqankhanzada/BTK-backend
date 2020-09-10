import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthNewUserDto, AuthCredentialsDto } from './auth-credentials.dto';
import { User } from '../users/users.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(authCredentialsDto: AuthCredentialsDto): Promise<any> {
        const user = await this.usersService.findOneByEmailOrNumber(authCredentialsDto.emailOrNumber);

        if (!user) {
            return null;
        }

        const valid = await bcrypt.compare(authCredentialsDto.password, user.password);
        if (valid) {
            return { user, authCredentialsDto};
        }

        return null;
    }

    async login({user, authCredentialsDto}: { user: User, authCredentialsDto: AuthCredentialsDto}) {
        const payload = { emailOrNumber: authCredentialsDto.emailOrNumber, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(authNewUserDto: AuthNewUserDto) {
        return this.usersService.register(authNewUserDto)
    }
}
