import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { NotificationUsersService } from './notification-users.service';
import { CreateNotificationUserDto } from './dto/create-notification-user.dto';
import { UpdateNotificationUserDto } from './dto/update-notification-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('notification-users')
export class NotificationUsersController {
  constructor(private readonly notificationUsersService: NotificationUsersService) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Request() req,
    @Body() createNotificationUserDto: CreateNotificationUserDto) {
    return this.notificationUsersService.create(createNotificationUserDto, req.user._id);
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // findAll(
  //   @Request() req,
  // ) {
  //   return this.notificationUsersService.findAll(req.user._id);
  // }

  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // findOne(
  //   @Param('id') id: string,
  //   @Request() req,
  //   ) {
  //   return this.notificationUsersService.findOne(id, req.user._id);
  // }

  // @Put(':id')
  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  // update(
  //   @Param('id') id: string, 
  //   @Body() updateNotificationDto: UpdateNotificationUserDto) {
  //   return this.notificationUsersService.update(id, updateNotificationDto);
  // }

  // @Delete(':id')
  // @Roles('ADMIN')
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  // remove(@Param('id') id: string) {
  //   return this.notificationUsersService.remove(id);
  // }
}
