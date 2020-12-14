import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
  ValidationPipe, ParseBoolPipe
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBusinessDTO, UpdateBusinessDTO, CreateReviewDTO } from './business.dto';
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
    @Query('category') category: string,
    @Query('search') search: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('popular', new DefaultValuePipe(false), ParseBoolPipe) popular: boolean,
    @Query('fields', new DefaultValuePipe([]), ParseArrayPipe) fields: [string]
  ): Promise<Business[]> {
    const projection: Record<string, number> = {};
    const options: Record<string, any> = { skip, limit };
    const query: Record<string, any> = { name: { $regex: search || '', $options: 'i' } };
    // Bring only required fields
    if(fields.length) {
      fields.forEach((key) => {
        projection[key.trim()] = 1;
      })
    }
    // Sort by popular
    if(popular) {
      options.sort = { views: -1 };
    }
    // Filter By Category
    if(category) {
      query.category = category;
    }
    return this.businessesService.findAll({
      query,
      projection,
      options
    });
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

  @Post('/:id/review')
  @UseGuards(JwtAuthGuard)
  createReview(@Param('id') id: string, @Request() req, @Body(ValidationPipe) createReviewDTO: CreateReviewDTO): Promise<Business> {
    const { _id, name, avatar } = req.user;
    return this.businessesService.createReview(id, { _id, name, avatar }, createReviewDTO);
  }
}
