import { Body, Controller, Param, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { ProfileUpdateDto } from '../auth/auth-credentials.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body(ValidationPipe) profileUpdateDto: ProfileUpdateDto) {
    return this.usersService.update(id, profileUpdateDto);
  }
}
