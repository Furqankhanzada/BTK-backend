import { Controller, Get, Post, Body, Put, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard, OptionalJwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
  findAll(
    @Request() req,
  ) {
    return this.notificationsService.findAll(req.user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string, 
    @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
