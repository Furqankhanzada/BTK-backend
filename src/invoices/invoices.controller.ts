import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res, Query, DefaultValuePipe, Header, UseGuards
} from "@nestjs/common";
import type { Response } from 'express'
import { HttpAdapterHost } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JsonParsePipe } from './json.parse.pipe';
import { InvoiceStatus } from "./invoice.schema";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller('invoices')
export class InvoicesController {
  @Header('Access-Control-Expose-Headers', 'Content-Range')
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Res({ passthrough: true }) res: Response,
    @Query('range', new DefaultValuePipe([0, 9]), JsonParsePipe) [skip, limit]: Array<number>,
    @Query('sort', new DefaultValuePipe(['_id', 'asc']), JsonParsePipe) [sortBy, order]: Array<string>,
    @Query('filter', JsonParsePipe) filter: Record<string, any>
  ) {
    console.log('filter', filter)
    filter = {...filter, status: { $ne: InvoiceStatus.PENDING }};
    const invoices = await this.invoicesService.findAll(filter, { skip, limit, sort: {[sortBy]: order.toLowerCase()} });
    const count = await this.invoicesService.getCount(filter);
    const { httpAdapter } = this.httpAdapterHost
    httpAdapter.setHeader(res, 'Content-Range', `invoices 0-${limit}/${count}`)
    return invoices.map((invoice) => ({...invoice.toObject(), id: invoice._id}));
  }
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly httpAdapterHost: HttpAdapterHost<ExpressAdapter>,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(+id, updateInvoiceDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(+id);
  }
}
