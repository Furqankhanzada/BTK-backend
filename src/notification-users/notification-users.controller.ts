import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { NotificationUsersService } from './notification-users.service';
import { CreateNotificationUserDto } from './dto/notification-user.dto';
import { JwtAuthGuardOptional } from 'src/auth/jwt-auth-optional.guard';

@Controller('notification-users')
export class NotificationUsersController {
  constructor(private readonly notificationUsersService: NotificationUsersService) {}
  
  @Post()
  @UseGuards(JwtAuthGuardOptional)
  create(
    @Request() req,
    @Body() createNotificationUserDto: CreateNotificationUserDto) {
    return this.notificationUsersService.create(createNotificationUserDto, req?.user?._id);
  }
}
