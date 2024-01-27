import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  Res, Query, DefaultValuePipe, Header, UseGuards, Req, UnauthorizedException
} from '@nestjs/common';
import type { Response, Request } from 'express'
import { HttpAdapterHost } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { InvoicesService } from './invoices.service';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JsonParsePipe } from './json.parse.pipe';
import { Invoice, InvoiceStatus } from "./invoice.schema";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Action, CaslAbilityFactory } from "../casl/casl-ability.factory";
import { Roles, User } from '../users/users.schema';

@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly httpAdapterHost: HttpAdapterHost<ExpressAdapter>,
    private abilityFactory: CaslAbilityFactory
  ) {}
  @Header('Access-Control-Expose-Headers', 'Content-Range')
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('range', new DefaultValuePipe([0, 9]), JsonParsePipe) [skip, limit]: Array<number>,
    @Query('sort', new DefaultValuePipe(['_id', 'asc']), JsonParsePipe) [sortBy, order]: Array<string>,
    @Query('filter', JsonParsePipe) filter: Record<string, any>
  ) {
    const user = req.user as User

    const ability = this.abilityFactory.createForUser(user, []);
    if (!ability.can(Action.Read, Invoice.name)) {
      throw new UnauthorizedException();
    }

    if (!user.roles.includes(Roles.ADMIN)) {
      const status = filter.status;
      filter = {...filter, ownerId: user._id, status: { $ne: InvoiceStatus.PENDING  }};
      if(status){
        filter.status.$eq = status;
      }
    }

    const invoices = await this.invoicesService.findAll(filter, { skip, limit, sort: {[sortBy]: order.toLowerCase()} });
    const count = await this.invoicesService.getCount(filter);
    const { httpAdapter } = this.httpAdapterHost
    httpAdapter.setHeader(res, 'Content-Range', `invoices 0-${limit}/${count}`)
    return invoices.map((invoice) => ({...invoice.toObject(), id: invoice._id}));
  }
  // @UseGuards(JwtAuthGuard)
  // @Post()
  // create(@Body() createInvoiceDto: CreateInvoiceDto) {
  //   return this.invoicesService.create(createInvoiceDto);
  // }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto
  ) {
    const user = req.user as User

    const ability = this.abilityFactory.createForUser(user, []);
    if (!ability.can(Action.Update, Invoice.name)) {
      throw new UnauthorizedException();
    }

    return this.invoicesService.update(id, updateInvoiceDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Req() req: Request,
    @Param('id') id: string
  ) {
    const user = req.user as User

    const ability = this.abilityFactory.createForUser(user, []);
    if (!ability.can(Action.Delete, Invoice.name)) {
      throw new UnauthorizedException();
    }

    return this.invoicesService.remove(id);
  }
}
