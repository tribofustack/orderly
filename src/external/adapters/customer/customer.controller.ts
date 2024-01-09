import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { responseError } from 'src/external/infra/errors/reponse.error';
import {
  CreatedCustomerSwagger,
  CreateCustomerSwagger,
} from 'src/internal/application/docs/swagger/customers/create-customer.dto';
import { GetCustomerSwagger } from 'src/internal/application/docs/swagger/customers/get-customer.dto';
import { CreateCustomerDto } from 'src/internal/domain/customers/dto/create-customer.dto';

import { CustomersService } from './customer.service';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'Create Customer' })
  @ApiBody({ type: CreateCustomerSwagger })
  @ApiResponse({
    status: 201,
    description: 'Customer successfully created.',
    type: CreatedCustomerSwagger,
  })
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      return await this.customersService.create(createCustomerDto);
    } catch (err) {
      return responseError(err);
    }
  }

  @ApiOperation({ summary: 'Get Customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer found.',
    type: GetCustomerSwagger,
  })
  @Get(':cpf')
  async getCustomer(@Param('cpf') cpf: string) {
    try {
      return await this.customersService.findByCpf(cpf);
    } catch (err) {
      return responseError(err);
    }
  }
}
