import {
  AttributeException,
  DomainException,
} from 'src/internal/application/errors';

export interface IProduct {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  quantity: number;
}

export class Product implements IProduct {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  quantity: number;

  constructor(product: IProduct) {
    this.validate(product);
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.categoryId = product.categoryId;
    this.price = product.price;
    this.quantity = product.quantity;
  }

  private validate(product: IProduct) {
    if (!product.id) throw new AttributeException('id not found.');
    if (!product.name) throw new AttributeException('name not found.');
    if (!product.description)
      throw new AttributeException('description not found.');
    if (!product.categoryId)
      throw new AttributeException('categoryId not found.');
    if (product.price < 0) throw new DomainException('price must be positive.');
    if (product.quantity < 0)
      throw new DomainException('quantity must be positive.');
  }

  // private validateCategory(category: categoryNamesDto) {
  //   const isAcceptableCategory = [
  //     'Lanche',
  //     'Acompanhamento',
  //     'Bebida',
  //     'Sobremesa',
  //   ].includes(category);
  //   if (!isAcceptableCategory) {
  //     throw new DomainException('category is not acceptable');
  //   }
  // }
}
