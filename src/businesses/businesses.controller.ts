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
  Request,
  UseGuards,
  ValidationPipe,
  ParseBoolPipe,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtAuthGuardOptional } from '../auth/jwt-auth-optional.guard';
import {
  CreateBusinessDTO,
  UpdateBusinessDTO,
  CreateReviewDTO,
  UpdateOwnerDTO,
} from './business.dto';
import { Business } from './business.schema';
import { BusinessesService } from './businesses.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BusinessAbilities, SUBJECT } from './business.abilities';
import { Action } from '../casl/casl-ability.factory';
import {
  CreateMembershipDto,
  UpdateMembershipDto,
} from '../auth/dto/business-member.dto';
import { Invitation, User } from '../users/users.schema';
import { EmailService } from '../email/email.service';

@Controller('businesses')
export class BusinessesController {
  constructor(
    private readonly businessesService: BusinessesService,
    private readonly businessAbility: BusinessAbilities,
    private emailService: EmailService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Invitation.name) private invitationModel: Model<Invitation>,
  ) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Request() req,
    @Body(ValidationPipe) createBusinessDTO: CreateBusinessDTO,
  ): Promise<Business> {
    const ability = this.businessAbility.get(req.user);

    if (!ability.can(Action.Create, SUBJECT)) {
      throw new UnauthorizedException();
    }

    return this.businessesService.create(createBusinessDTO, req.user._id);
  }

  @Get()
  @UseGuards(JwtAuthGuardOptional)
  findAll(
    @Request() req,
    @Query('category') category: string | string[],
    @Query('tags') tags: string | string[],
    @Query('facilities') facilities: string | string[],
    @Query('search') search: string,
    @Query('ownerId') ownerId: string,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('radius', new DefaultValuePipe(5000), ParseIntPipe) radius: number, // meters, default: 5 km
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('favorite', new DefaultValuePipe(false), ParseBoolPipe)
    favorite: boolean,
    @Query('popular', new DefaultValuePipe(false), ParseBoolPipe)
    popular: boolean,
    @Query('recent', new DefaultValuePipe(false), ParseBoolPipe)
    recent: boolean,
    @Query('fields', new DefaultValuePipe([]), ParseArrayPipe) fields: string[],
  ): Promise<Business[]> {
    const { user } = req;

    const projection: Record<string, number> = {};
    const options: Record<string, any> = { skip, limit };
    const query: Record<string, any> = {
      name: { $regex: search || '', $options: 'i' },
    };
    // Bring only required fields
    if (fields.length) {
      fields.forEach(key => {
        projection[key.trim()] = 1;
      });
    }

    // Sort by popular
    if (popular) {
      options.sort = { views: -1 };
    }

    // Sort by recent
    if (recent) {
      options.sort = { createdAt: -1 };
    }

    // Filter By Category
    if (category) {
      category = Array.isArray(category) ? category : [category];
      query.category = { $in: category };
    }

    // Filter By Tags
    if (tags) {
      tags = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tags };
    }

    // Filter By Facility
    if (facilities) {
      facilities = Array.isArray(facilities) ? facilities : [facilities];
      query['facilities.name'] = { $in: facilities };
    }

    // Filter By Owner
    if (ownerId) {
      query.ownerId = ownerId;
    }

    // Filter by favorite - only for logged in user
    if (favorite && user) {
      query['favorites.ownerId'] = user._id.toString();
    }

    // Use user's geo location. Using the first address. Overrides general location.
    if (
      user?.addresses?.length &&
      user.addresses[0].location?.coordinates?.length
    ) {
      [longitude, latitude] = user.addresses[0].location.coordinates;
    }

    // Use the provided coordinates, overrides others coordinates.
    if (latitude && longitude) {
      options.geoLocation = {
        coordinates: [Number(longitude), Number(latitude)],
        maxDistance: radius,
      };
    }

    return this.businessesService.findAll({
      query,
      projection,
      options,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body(ValidationPipe) updateBusinessDTO: UpdateBusinessDTO,
  ) {
    const ability = this.businessAbility.get(req.user);
    const business = await this.businessesService.getOne({ _id: id });

    if (!ability.can(Action.Update, business)) {
      throw new UnauthorizedException();
    }

    return this.businessesService.update({ _id: id }, updateBusinessDTO);
  }

  @Put('changeowner/:id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async updateOwnerId(
    @Param('id') id: string,
    @Request() req,
    @Body(ValidationPipe) updateOwnerDTO: UpdateOwnerDTO,
  ) {
    return this.businessesService.changeOwner({ _id: id }, updateOwnerDTO);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    const ability = this.businessAbility.get(req.user);
    const business = await this.businessesService.getOne({ _id: id });

    if (!ability.can(Action.Delete, business)) {
      throw new UnauthorizedException();
    }

    return this.businessesService.remove(id);
  }

  @Post('/:id/review')
  @UseGuards(JwtAuthGuard)
  createReview(
    @Param('id') id: string,
    @Request() req,
    @Body(ValidationPipe) createReviewDTO: CreateReviewDTO,
  ): Promise<Business> {
    const { _id, name, avatar } = req.user;
    return this.businessesService.createReview(
      id,
      { _id, name, avatar },
      createReviewDTO,
    );
  }

  @Post('/:id/member')
  @UseGuards(JwtAuthGuard)
  async createMember(
    @Request() req,
    @Param('id') id: string,
    @Body(ValidationPipe) createMembershipDto: CreateMembershipDto,
  ) {
    const business = await this.businessesService.findOne(id);

    if (req.user._id.toString() !== business.ownerId) {
      throw new UnauthorizedException();
    }

    const user = await this.userModel
      .findOne({ email: createMembershipDto.email })
      .exec();

    if (user) {
      // User is registered, proceed with adding the membership
      return this.businessesService.createMember(id, createMembershipDto);
    }

    //Check if invitation for current busienss is already exists in collection
    const invitationExist = await this.invitationModel
      .findOne({
        email: createMembershipDto.email,
        businessId: id,
      })
      .exec();

    if (invitationExist) {
      throw new ConflictException('Invitation already sent to this user.');
    }

    // User is not registered, handle the invitation logic here
    await this.emailService.sendRawEmail({
      from: process.env.FROM,
      to: createMembershipDto.email,
      subject: 'Invitation to Explore BTK',
      html: `
        <h3>Hi, ${createMembershipDto.email}</h3>
        <p>You were added as a member of ${business.name} by ${req.user.email}.</p>
        <p><a href="http://onelink.to/xwhffr">Download the Explore BTK</a> App now, To see your membership details.</p>
        `,
    });

    // Create an invitation object and save it in the invitations collection
    const invitation = new this.invitationModel({
      email: createMembershipDto.email,
      businessId: id,
      package: createMembershipDto.package,
      billingDate: createMembershipDto.billingDate,
    });

    await invitation.save();
    return { message: 'invitation-sent' };
  }

  @Delete('/:id/member')
  @UseGuards(JwtAuthGuard)
  async deleteMember(
    @Request() req,
    @Param('id') id: string,
    @Query('email') email: string,
  ) {
    const business = await this.businessesService.findOne(id);

    if (req.user._id.toString() !== business.ownerId) {
      throw new UnauthorizedException();
    }

    return this.businessesService.deleteMember(id, email);
  }

  @Put('/:id/member')
  @UseGuards(JwtAuthGuard)
  async updateMember(
    @Request() req,
    @Param('id') id: string,
    @Body(ValidationPipe) updateMemberDto: UpdateMembershipDto,
  ) {
    const business = await this.businessesService.findOne(id);

    if (req.user._id.toString() !== business.ownerId) {
      throw new UnauthorizedException();
    }

    return this.businessesService.updateMember(id, updateMemberDto);
  }

  @Get('/:id/members')
  async getBusinessMembers(@Param('id') id: string) {
    return this.businessesService.getBusinessMembers(id);
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
