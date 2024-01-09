import { Inject, Injectable } from '@nestjs/common';
import { UpdateProductDto } from 'src/internal/domain/product/dto/update-product.dto';
import { CreateProductDto } from 'src/internal/domain/product/dto/create-product.dto';
import { IProductRepository } from 'src/internal/domain/product/repositories/product.repository';
import { Product } from 'src/internal/domain/product/entities/product.entity';
import { IIdentifierGenerator } from 'src/internal/application/ports/tokens/id-generator';
import { VerifyProductDto } from 'src/internal/domain/product/dto/verify-product.dto';
import { DomainException } from 'src/internal/application/errors';
import EventEmitter from 'events';
import { ProductDecreasedEvent } from 'src/internal/domain/product/events/product-decreased.event';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('ProductRepository')
    private productRepository: IProductRepository,

    @Inject('IdGenerator')
    private idGenerator: IIdentifierGenerator,

    @Inject('EventEmitter')
    private eventEmitter: EventEmitter,
  ) {}

  async create(createProductDto: CreateProductDto) {
      const product = new Product({
        id: this.idGenerator.generate(),
        name: createProductDto.name,
        categoryId: createProductDto.categoryId,
        description: createProductDto.description,
        price: createProductDto.price,
        quantity: createProductDto.quantity,
      });
      await this.productRepository.create(product);
      return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  async verifyProductQuantity(products: VerifyProductDto[]) {
    const productVerified = [];
    for (const p of products) {
      const product = await this.productRepository.findOne(p.id);
      const quantity = product.quantity - p.quantity;
      const isEnough = quantity >= 0;
      if (!isEnough)
        throw new DomainException('product quantity is not enough.');

      productVerified.push({ id: product.id, quantity, value: product.price });
    }

    this.eventEmitter.emit(
      'product.verified',
      new ProductDecreasedEvent(productVerified),
    );
  }

  async delete(id: string) {
    return this.productRepository.delete(id);
  }

  async findByCategory(id: string) {
    return await this.productRepository.findByCategory(id);
  }

  async getCategories() {
    return this.productRepository.getCategories();
  }
}
