import {
    Body,
    Controller,
    DefaultValuePipe, Delete,
    Get,
    Param,
    ParseIntPipe,
    Post, Put,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateContactDto } from './contact.dto';
import { Contact } from './contact.schema';
import { Roles as RolesEnum } from '../users/users.schema';
import { Request } from 'express';

@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}
    @Post()
    @Roles(RolesEnum.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
        return this.contactsService.create(createContactDto);
    }

    @Get()
    findAll(
        @Req() request: Request,
        @Query('search') search: string,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number
    ): Promise<Contact[]> {
        return this.contactsService.findAll({ query: { name: { $regex: search || '', $options: 'i' } }, options: { skip, limit } });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.contactsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() createContactDto: CreateContactDto) {
        return this.contactsService.update(id, createContactDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return `This action removes a #${id} cat`;
    }
}
