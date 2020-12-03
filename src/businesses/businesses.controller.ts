import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBusinessDTO } from './business.dto';
import { Business } from './business.schema';
import { BusinessesService } from './businesses.service';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body(ValidationPipe) createBusinessDTO: CreateBusinessDTO): Promise<Business> {
    return this.businessesService.create(createBusinessDTO);
  }
}
