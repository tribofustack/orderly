import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from 'src/internal/domain/product/dto/create-product.dto';
import { UpdateProductDto } from 'src/internal/domain/product/dto/update-product.dto';
import { responseError } from 'src/external/infra/errors/reponse.error';

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductSwagger, CreatedProductSwagger } from 'src/internal/application/docs/swagger/product/create-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductsService) { }

  @ApiOperation({ summary: 'Create Product' })
  @ApiBody({ type: CreateProductSwagger })
  @ApiResponse({ status: 201, description: 'Product successfully created.', type: CreatedProductSwagger })
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productsService.create(createProductDto);
    } catch (err: any) {
      return responseError(err);
    }
  }

  @ApiOperation({ summary: 'Update Product' })
  @ApiResponse({ status: 201, description: 'Product successfully Updated.' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      return await this.productsService.update(id, updateProductDto);
    } catch (err: any) {
      return responseError(err);
    }
  }

  @ApiOperation({ summary: 'Delete Product' })
  @ApiResponse({ status: 201, description: 'Product successfully Deleted.' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.productsService.delete(id);
    } catch (err: any) {
      return responseError(err);
    }
  }

  @ApiOperation({ summary: 'Get Product' })
  @ApiResponse({ status: 200 })
  @Get('category/:id')
  async findByCategory(@Param('id') id: string) {
    try {
      return await this.productsService.findByCategory(id);
    } catch (err: any) {
      return responseError(err);
    }
  }

  @ApiOperation({ summary: 'Get Categories' })
  @ApiResponse({ status: 200 })
  @Get('category/')
  async getCategories() {
    try {
      return await this.productsService.getCategories();
    } catch (err: any) {
      return responseError(err);
    }
  }
}
