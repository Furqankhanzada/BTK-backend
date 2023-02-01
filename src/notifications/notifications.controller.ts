import { Controller, Get, Post, Body, Put, Param, Delete, Request, UseGuards, Query, DefaultValuePipe, ParseBoolPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtAuthGuardOptional } from 'src/auth/jwt-auth-optional.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  
  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuardOptional)
  async findAll(
    @Request() req,
    @Query('deviceUniqueId') deviceUniqueId: string,
    @Query('unreadCount') unreadCount: boolean,
    @Query('recent', new DefaultValuePipe(false), ParseBoolPipe)
    recent: boolean,
  ) {

    const notifications = this.notificationsService.findAll(req.user._id?.toString(), deviceUniqueId, recent);
    const unreadNotifications = (await notifications).filter((notification) => {
      return !notification?.read;
    })

    if (unreadCount) {
      return { unread: unreadNotifications.length };
    }

    return await notifications;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuardOptional)
  findOne(
    @Param('id') id: string,
    @Request() req,
    ) {
    return this.notificationsService.findOne(id, req?.user);
  }

  @Put(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string, 
    @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
