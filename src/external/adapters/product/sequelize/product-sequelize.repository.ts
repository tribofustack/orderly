import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Product } from 'src/internal/domain/product/entities/product.entity';
import { IProductRepository, categoriesToCreate } from 'src/internal/domain/product/repositories/product.repository';

import { ProductModel } from './product.model';
import { CategoryModel } from './category.model';
import { Category } from 'src/internal/domain/product/entities/category.entity';

export class ProductSequelizeRepository implements IProductRepository {
  constructor(
    @InjectModel(ProductModel)
    private model: typeof ProductModel,
    @InjectModel(CategoryModel)
    private categoryModel: typeof CategoryModel,
  ) {}

  async createCategories(
    categoriesToCreate: categoriesToCreate,
  ): Promise<void> {
    Promise.all([
      categoriesToCreate.map(async (category) =>
        this.categoryModel.create(category),
      ),
    ]);
  }

  async getCategories(): Promise<Category[]> {
    const categories = await this.categoryModel.findAll();
    if (categories.length < 1)
      throw new NotFoundException('categories not exists.');
    return categories.map(
      (c) =>
        new Category({
          id: c.id,
          name: c.name,
          description: c.description,
        }),
    );
  }

  async updateQuantity(id: string, quantity: number): Promise<number> {
    await this.model.update({ quantity }, { where: { id } });
    return quantity;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const productModel = await this.model.findAll({
      where: { categoryId },
    });
    if (!productModel || productModel.length === 0)
      throw new NotFoundException('product category not exists.');

    return productModel.map(pm => {
      return new Product({
        id: pm.id,
        categoryId: pm.categoryId,
        description: pm.description,
        name: pm.name,
        price: Number(pm.price),
        quantity: pm.quantity,
      });
    });
  }

  async findOne(id: string): Promise<Product> {
    const productModel = await this.model.findOne({ where: { id } });
    if (!productModel) throw new NotFoundException('product id not exists.');

    return new Product({
      id: productModel.id,
      categoryId: productModel.categoryId,
      description: productModel.description,
      name: productModel.name,
      price: productModel.price,
      quantity: productModel.quantity,
    });
  }

  async findAll(): Promise<Product[]> {
    const productsModel = await this.model.findAll();

    return productsModel.map(p => {
      return new Product({
        id: p.id,
        name: p.name,
        categoryId: p.categoryId,
        description: p.description,
        price: p.price,
        quantity: p.quantity,
      });
    });
  }

  async create(params: Partial<Product>): Promise<Product> {
    const productModel = await this.model.create(params);

    return new Product({
      id: productModel.id,
      categoryId: productModel.categoryId,
      description: productModel.description,
      name: productModel.name,
      price: productModel.price,
      quantity: productModel.quantity,
    });
  }

  async delete(id: string): Promise<void> {
    await this.model.destroy({ where: { id } });
  }

  async update(
    id: string,
    { name, price, description, categoryId }: Partial<Product>,
  ): Promise<void> {
    await this.model.update(
      { name, price, description, categoryId },
      { where: { id } },
    );
  }
}
