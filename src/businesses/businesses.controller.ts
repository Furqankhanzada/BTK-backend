import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBusinessDTO, UpdateBusinessDTO } from './business.dto';
import { Business } from './business.schema';
import { BusinessesService } from './businesses.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body(ValidationPipe) createBusinessDTO: CreateBusinessDTO): Promise<Business> {
    return this.businessesService.create(createBusinessDTO, req.user._id);
  }

  @Get()
  findAll(
    @Req() request: Request,
    @Query('search') search: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number
  ): Promise<Business[]> {
    return this.businessesService.findAll({ query: { name: { $regex: search || '', $options: 'i' } }, options: { skip, limit } });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Request() req, @Body(ValidationPipe) updateBusinessDTO: UpdateBusinessDTO) {
    return this.businessesService.update({ _id: id, ownerId: req.user._id }, updateBusinessDTO);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.businessesService.remove(id);
  }
}
