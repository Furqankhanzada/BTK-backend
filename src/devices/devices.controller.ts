import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OptionalJwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}
  
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(
    @Request() req,
    @Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto, req.user._id);
  }

  @Get()
  findAll() {
    return this.devicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }
}
