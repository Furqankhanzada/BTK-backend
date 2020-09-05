import { Body, Controller, Get, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthNewUserDto } from './auth-credentials.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('/signup')
    async signUp(@Body(ValidationPipe) authNewUserDto: AuthNewUserDto): Promise<any> {
        return this.authService.register(authNewUserDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
