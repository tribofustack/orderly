import { Controller, Post, Body, Get, Param, Query  } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { responseError } from 'src/external/infra/errors/reponse.error';
import {
  CreateOrderSwagger,
  CreatedOrderSwagger,
} from 'src/internal/application/docs/swagger/checkout/create-order.dto';
import { CreateOrderDto } from 'src/internal/domain/checkout/dto/create-order.dto';

import { ProductsService } from '../product/product.service';
import { OrdersService } from './order.service';
import { CustomersService } from '../customer/customer.service';

@ApiTags('Order')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
    private readonly customerService: CustomersService,
  ) {}

  @ApiOperation({ summary: 'Create Order' })
  @ApiBody({ type: CreateOrderSwagger })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created.',
    type: CreatedOrderSwagger,
  })
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      await this.productsService.verifyProductQuantity(createOrderDto.products);
      return await this.ordersService.create(createOrderDto);
    } catch (err) {
      return responseError(err);
    }
  }

  @ApiOperation({ summary: 'Prepare Order' })
  @ApiResponse({ status: 200 })
  @Post(':orderId/prepare')
  async prepare(@Param('orderId') orderId: string) {
    try {
      return await this.ordersService.prepare(orderId);
    } catch (err) {
      return responseError(err);
    }
  }

  @ApiOperation({ summary: 'withdrawn' })
  @ApiResponse({ status: 200 })
  @Post(':orderId/withdrawn')
  async withdrawn(@Param('orderId') orderId: string) {
    try {
      return await this.ordersService.withdrawn(orderId);
    } catch (err) {
      return responseError(err);
    }
  }

  @ApiOperation({ summary: 'Get Orders' })
  @ApiResponse({ status: 201, description: 'Order successfully created.' })
  @ApiQuery({
    name: "customerId",
		description: "Query by customer id.",
		required: false,
		type: String
  })
  @ApiQuery({
    name: "status",
		description: "Query by order status.",
		required: false,
		type: String
  })
  @Get()
  async getOrders(
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
  ) {
    try {
      return await this.ordersService.findAll(customerId, status);
    } catch (err) {
      return responseError(err);
    }
  }

  @Get(':id/status')
  async getStatus(@Param('id') id: string) {
    try {
      return await this.ordersService.getStatus(id);
    } catch (err: any) {
      return responseError(err);
    }
  }

  @Get('customer/:id')
  async getCustomerReport(@Param('id') id: string) {
    try {
      await this.customerService.findById(id);
      return await this.ordersService.getCustomerReport(id);
    } catch (err: any) {
      return responseError(err);
    }
  }
}
