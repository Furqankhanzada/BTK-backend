import {
  Body,
  Controller,
  Param,
  Put,


  Request,
  UnauthorizedException, UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { ProfileUpdateDto } from '../auth/auth-credentials.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Action } from '../casl/casl-ability.factory';
import { UsersAbilities } from './users.abilities';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userAbility: UsersAbilities,
  ) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body(ValidationPipe) profileUpdateDto: ProfileUpdateDto,
  ) {
    const ability = this.userAbility.get(req.user);
    const user = await this.usersService.findOne(id);

    if (!ability.can(Action.Update, user)) {
      throw new UnauthorizedException();
    }

    return this.usersService.update(id, profileUpdateDto);
  }
}
