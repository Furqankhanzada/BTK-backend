import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { NotificationUsersService } from './notification-users.service';
import { CreateNotificationUserDto } from './dto/create-notification-user.dto';
import { JwtAuthGuard, OptionalJwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('notification-users')
export class NotificationUsersController {
  constructor(private readonly notificationUsersService: NotificationUsersService) {}
  
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(
    @Request() req,
    @Body() createNotificationUserDto: CreateNotificationUserDto) {
    return this.notificationUsersService.create(createNotificationUserDto, req.user._id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Request() req,
  ) {
    return this.notificationUsersService.findAll(req.user._id);
  }
}
