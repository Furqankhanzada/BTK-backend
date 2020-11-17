import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ProfileUpdateDto } from '../auth/auth-credentials.dto';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Roles as RolesEnum } from './users.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put(':id')
  @Roles(RolesEnum.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() profileUpdateDto: ProfileUpdateDto) {
    return this.usersService.update(id, profileUpdateDto);
  }
}
