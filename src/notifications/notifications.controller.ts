import { Controller, Get, Post, Body, Put, Param, Delete, Request, UseGuards, Query, DefaultValuePipe, ParseBoolPipe } from '@nestjs/common';
import { findAllNotificationsOptions, NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard, OptionalJwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(
    @Request() req,
    @Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto, req.user._id);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(
    @Request() req,
    @Query('deviceUniqueId') deviceUniqueId: string,
    @Query('unreadCount') unreadCount: boolean,
    @Query('recent', new DefaultValuePipe(false), ParseBoolPipe)
    recent: boolean,
  ) {
    const options: findAllNotificationsOptions = { deviceUniqueId };

    // Sort by recent
    if (recent) {
      options.sort = { createdAt: -1 };
    }

    const notifications = this.notificationsService.findAll(req.user._id?.toString(), options);
    const unreadNotifications = (await notifications).filter((notification) => {
      return !notification?.read;
    })

    if (unreadCount) {
      return { unread: unreadNotifications.length };
    }

    return await notifications;
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  findOne(
    @Param('id') id: string,
    @Request() req,
    ) {
    return this.notificationsService.findOne(id, req.user._id);
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
