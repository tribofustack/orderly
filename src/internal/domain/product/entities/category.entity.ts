import { AttributeException } from 'src/internal/application/errors';
import { categoryNamesDto } from '../dto/category-name.dto';

export interface ICategory {
  id: string;
  name: categoryNamesDto;
  description: string;
}

export class Category implements ICategory {
  id: string;
  name: categoryNamesDto;
  description: string;

  constructor(category: ICategory) {
    this.validate(category);

    this.id = category.id;
    this.name = category.name;
    this.description = category.description;
  }

  private validate(category: ICategory) {
    if (!category.id) throw new AttributeException('name not found.');
    if (!category.name) throw new AttributeException('name not found.');
    if (!category.description)
      throw new AttributeException('description not found.');
  }
}
