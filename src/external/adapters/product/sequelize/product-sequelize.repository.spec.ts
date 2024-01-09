import {
  closeDatabase,
  initDatabase,
} from 'src/external/infra/database/sequelize';
import { IProductRepository } from 'src/internal/domain/product/repositories/product.repository';

import { ProductSequelizeRepository } from './product-sequelize.repository';
import { ProductModel } from './product.model';
import { CategoryModel } from './category.model';

let model: typeof ProductModel;
let categoryModel: typeof CategoryModel;
let repository: IProductRepository;

describe('Product Sequelize Repository', () => {
  beforeAll(async () => {
    await initDatabase();
    model = ProductModel;
    categoryModel = CategoryModel
    repository = new ProductSequelizeRepository(model, categoryModel);
  });
  afterAll(async () => closeDatabase());

  describe('updateQuantity', () => {
    it('should update product quantity by id', async () => {
      // arrange
      const productId = 'abcd-efgh-ijkl';
      const categoryId = 'abcd-efgh-ijkl-mno';

      const quantity = 1;
      await categoryModel.create({
        id: categoryId,
        name: 'category-name-test',        
        description: 'description-name-test',        
      });
      await model.create({
        id: productId,
        name: 'product-name-test',
        categoryId,
        description: 'description-name-test',
        price: 140,
        quantity,
      });
      // act
      const newQuantity = await repository.updateQuantity(productId, 2);
      const productModel = await model.findOne({ where: { id: productId } });
      // assert
      expect(newQuantity).toBe(2);
      expect(newQuantity).not.toBe(quantity);
      expect(productModel.quantity).toBe(newQuantity);
    });
  });
});
