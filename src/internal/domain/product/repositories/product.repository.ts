import { IRepository } from 'src/internal/application/ports/repositories/repository';

import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';

export type categoriesToCreate = {
  id: string;
  name: string;
  description: string;
}[];

export interface IProductRepository extends IRepository<Product> {
  findByCategory(categoryId: string): Promise<Product[]>;
  updateQuantity(id: string, quantity: number): Promise<number>;
  createCategories(categories: categoriesToCreate): Promise<void>;
  getCategories(): Promise<Category[]>;
}
