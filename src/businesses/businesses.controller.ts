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
import { JwtAuthGuardOptional } from '../auth/jwt-auth-optional.guard';
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
  @UseGuards(JwtAuthGuardOptional)
  findAll(
    @Request() req,
    @Query('category') category: string | string[],
    @Query('search') search: string,
    @Query('ownerId') ownerId: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('favorite', new DefaultValuePipe(false), ParseBoolPipe) favorite: boolean,
    @Query('popular', new DefaultValuePipe(false), ParseBoolPipe) popular: boolean,
    @Query('fields', new DefaultValuePipe([]), ParseArrayPipe) fields: [string]
  ): Promise<Business[]> {
    const { user } = req;

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
      category = Array.isArray(category) ? category : [category];
      query.category = { $in: category };
    }

    // Filter By Owner
    if(ownerId) {
      query.ownerId = ownerId;
    }

    // Filter by favorite - only for logged in user
    if(favorite && user) {
      query['favorites.ownerId'] = user._id.toString();
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
  update(@Param('id') id: string, @Request() req, @Body(new ValidationPipe({ whitelist: true })) updateBusinessDTO: UpdateBusinessDTO) {
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

  @Post('/:id/favorite')
  @UseGuards(JwtAuthGuard)
  createFavorite(@Param('id') id: string, @Request() req): Promise<Business> {
    const { _id } = req.user;
    return this.businessesService.createFavorite(id, _id);
  }

  @Delete('/:id/favorite')
  @UseGuards(JwtAuthGuard)
  removeFavorite(@Param('id') id: string, @Request() req): Promise<Business> {
    const { _id } = req.user;
    return this.businessesService.removeFavorite(id, _id);
  }
}
