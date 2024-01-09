import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CustomerModel } from '../../customer/sequelize/customer.model';
import { OrderModel } from '../../checkout/sequelize/order-model';

interface IPaymentModel {
  id: string;
  customerId: string;
  orderId: string;
  value: number;
  paymentType: string;
  status: string;
  qrCode: string;
  url: string;
}

@Table({
  tableName: 'payments',
  timestamps: true,
})
class PaymentModel extends Model implements IPaymentModel {
  @Column({
    field: 'id',
    primaryKey: true,
    unique: true,
    allowNull: false,
    type: DataType.STRING,
  })
  declare id: string;

  @ForeignKey(() => CustomerModel)
  @Column({
    field: 'customer_id',
    allowNull: false,
    type: DataType.STRING,
  })
  declare customerId: string;

  @BelongsTo(() => CustomerModel)
  declare customer: CustomerModel;

  @ForeignKey(() => OrderModel)
  @Column({
    field: 'order_id',
    allowNull: false,
    type: DataType.STRING,
  })
  declare orderId: string;

  @BelongsTo(() => OrderModel)
  declare order: OrderModel;

  @Column({
    field: 'status',
    allowNull: false,
    type: DataType.STRING,
  })
  declare status: string;

  @Column({
    field: 'value',
    allowNull: false,
    type: DataType.DECIMAL(10, 2),
  })
  declare value: number;

  @Column({
    field: 'payment_type',
    allowNull: true,
    type: DataType.STRING,
  })
  declare paymentType: string;

  @Column({
    field: 'qr_code',
    allowNull: true,
    type: DataType.STRING,
  })
  declare qrCode: string;

  @Column({
    field: 'url',
    allowNull: true,
    type: DataType.STRING,
  })
  declare url: string;
}

export { PaymentModel };
