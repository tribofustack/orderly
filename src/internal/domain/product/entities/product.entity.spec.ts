import { AttributeException } from 'src/internal/application/errors';

import { IProduct, Product } from './product.entity';

describe('Product Entity', () => {
  describe('validate', () => {
    it('should validate id', () => {
      // arrange
      let product: IProduct;
      try {
        // act
        product = new Product({
          id: null,
          categoryId: 'category-test',
          description: 'description-test',
          name: 'name-test',
          price: 3.5,
          quantity: 1,
        });
      } catch (error) {
        // assert
        expect(error).toBeTruthy();
        expect(error.message).toBe('id not found.');
        expect(error).toBeInstanceOf(AttributeException);
      }
      expect(product).toBeFalsy();
    });
    it('should validate name', () => {
      let product: IProduct;
      try {
        product = new Product({
          id: 'id-test',
          categoryId: 'category-test',
          description: 'description-test',
          name: null,
          price: 3.5,
          quantity: 1,
        });
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('name not found.');
        expect(error).toBeInstanceOf(AttributeException);
      }
      expect(product).toBeFalsy();
    });
  });
});
