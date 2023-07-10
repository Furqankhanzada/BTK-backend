import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BusinessMembersService } from './business-members.service';
import {
  BusinessMembersDto,
  UpdateBusinessMembersDto,
} from './dto/create-business-members.dto';
import { BusinessMembers } from './business-members.schema';
import { BusinessesService } from 'src/businesses/businesses.service';

@Controller('business-members')
export class BusinessMembersController {
  constructor(
    private readonly businessMembersService: BusinessMembersService,
    private readonly businessesService: BusinessesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req,
    @Body(ValidationPipe) createBusinessMemberDto: BusinessMembersDto,
  ): Promise<BusinessMembers> {
    const business = await this.businessesService.findOne(
      createBusinessMemberDto.businessId,
    );

    if (req.user._id.toString() === business.ownerId) {
      return this.businessMembersService.create(createBusinessMemberDto);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get(':businessId')
  findOne(@Param('businessId') businessId: string) {
    return this.businessMembersService.findOne(businessId);
  }

  @Put(':businessId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('businessId') businessId: string,
    @Request() req,
    @Body(ValidationPipe) updateBusinessMembersDto: UpdateBusinessMembersDto,
  ) {
    const business = await this.businessesService.findOne(businessId);

    if (req.user._id.toString() === business.ownerId) {
      return this.businessMembersService.update(
        { businessId },
        updateBusinessMembersDto,
      );
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete(':businessId')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('businessId') businessId: string, @Request() req) {
    const business = await this.businessesService.findOne(businessId);

    if (req.user._id.toString() === business.ownerId) {
      return this.businessMembersService.remove(businessId);
    } else {
      throw new UnauthorizedException();
    }
  }
}
