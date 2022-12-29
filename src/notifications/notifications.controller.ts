import { Controller, Get, Post, Body, Put, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  createWithOwner(
    @Request() req,
    @Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.createWithOwner(createNotificationDto, req.user._id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
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
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
