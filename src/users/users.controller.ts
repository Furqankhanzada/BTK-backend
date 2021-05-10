import {
  Body,
  Controller, DefaultValuePipe, Get,
  Param, ParseArrayPipe, ParseIntPipe,
  Put, Query, Req,


  Request,
  UnauthorizedException, UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProfileUpdateDto } from '../auth/auth-credentials.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Action } from '../casl/casl-ability.factory';
import { UsersAbilities } from './users.abilities';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userAbility: UsersAbilities,
  ) {}

  @Get()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  findAll(
    @Req() request: Request,
    @Query('search') search: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('fields', new DefaultValuePipe([]), ParseArrayPipe) fields: [string]
  ): Promise<User[]> {
    const projection: Record<string, number> = {};
    const options: Record<string, any> = { skip, limit };
    const query: Record<string, any> = { name: { $regex: search || '', $options: 'i' } };

    // Bring only required fields
    if(fields.length) {
      fields.forEach((key) => {
        projection[key.trim()] = 1;
      });
    }

    return this.usersService.findAll({ query, projection, options });
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

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
