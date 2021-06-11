import { Body, Controller, Get, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthNewUserDto } from './auth-credentials.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

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

    @Post('/forgotpassword')
    async forgotPassword(@Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto): Promise<any> {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('verifyCode')
    async verifyCode(@Body(ValidationPipe) verifyCodeDto: VerifyCodeDto): Promise<any> {
        return this.authService.verifyCode(verifyCodeDto);
    }

    @Post('/changePassword')
    @UseGuards(JwtAuthGuard)
    async changePassword(
      @Request() req,
      @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
    ): Promise<boolean> {
        return this.authService.changePassword(req.user._id, changePasswordDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
