import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './invitation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createInvitationDto: CreateInvitationDto) {
    return this.invitationService.create(createInvitationDto);
  }
}
