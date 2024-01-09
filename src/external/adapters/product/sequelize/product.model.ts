import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { IProduct } from 'src/internal/domain/product/entities/product.entity';
import { CategoryModel } from './category.model';

export interface IProductModel extends IProduct {}

@Table({
  tableName: 'products',
  timestamps: false,
})
export class ProductModel extends Model implements IProductModel {
  @Column({
    field: 'id',
    primaryKey: true,
    unique: true,
    allowNull: false,
    type: DataType.STRING,
  })
  declare id: string;

  @Column({
    field: 'name',
    allowNull: false,
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    field: 'description',
    allowNull: true,
    unique: false,
    type: DataType.STRING,
  })
  declare description: string;

  @ForeignKey(() => CategoryModel)
  @Column({
    field: 'category_id',
    allowNull: false,
    type: DataType.STRING,
  })
  declare categoryId: string;

  @BelongsTo(() => CategoryModel)
  declare category: CategoryModel;

  @Column({
    field: 'price',
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    unique: false,
  })
  declare price: number;

  @Column({
    field: 'quantity',
    type: DataType.INTEGER,
    allowNull: false,
    unique: false,
  })
  declare quantity: number;
}
