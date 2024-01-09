import { IOrderRepository, ITotalReport } from 'src/internal/domain/checkout/repositories/order.repository';
import { OrderItemModel } from './order-item-model';
import { OrderModel } from './order-model';
import { Order } from 'src/internal/domain/checkout/entities/order.entity';
import { OrderItem } from 'src/internal/domain/checkout/entities/order-item.entity';
import { InjectModel } from '@nestjs/sequelize';
import { orderStatusDto } from 'src/internal/domain/checkout/dto/order-status.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

export class OrderSequelizeRepository implements IOrderRepository {
  constructor(
    @InjectModel(OrderModel)
    private orderM: typeof OrderModel,
    @InjectModel(OrderItemModel)
    private orderItemM: typeof OrderItemModel,
  ) {}

  async getStatus(id: string): Promise<{ status: string }> {
    const order = await this.orderM.findOne({ where: { id } });
    return {
      status: order.status,
    };
  }

  async getReportByCustomer(customerId: string): Promise<ITotalReport> {
    const purchases = await this.orderM.count({
      where: { customerId },
      col: 'id',
    });
    const total = await this.orderM.sum('total', { where: { customerId } });

    return {
      purchases: purchases ?? 0,
      value: total ?? 0,
    };
  }

  async changeStatus(orderId: string, status: string): Promise<void> {
    await this.orderM.update({ status }, { where: { id: orderId } });
  }

  async findOne(id: string): Promise<Order | null> {
    const orderModel = await this.orderM.findByPk(id, {
      include: [
        {
          model: OrderItemModel,
          as: 'orderItems',
        },
      ],
    });

    if (!orderModel) return null;

    const orderItems = orderModel.orderItems.map((item) => {
      return new OrderItem({
        id: item.id,
        value: Number(item.value),
        productId: item.productId,
        quantity: item.quantity,
      });
    });

    const order = new Order({
      id: orderModel.id,
      customerId: orderModel.customerId,
      orderItems,
      createdAt: orderModel.createdAt,
    });
    order.updateStatus(orderModel.status as orderStatusDto);

    return order;
  }

  async findAll(
    customerIdQuery?: string,
    statusQuery?: string,
  ): Promise<Order[]> {
    const customerId = customerIdQuery ? { customerId: customerIdQuery } : {};
    const status = statusQuery ? { status: statusQuery } : {};
    const orderModels = await this.orderM.findAll({
      where: { ...customerId, ...status },
      include: [
        {
          model: OrderItemModel,
          as: 'orderItems',
        },
      ],
    });

    if (orderModels.length < 1) return [];

    return orderModels.map((om) => {
      const orderItems = om.orderItems.map((item) => {
        return new OrderItem({
          id: item.id,
          value: Number(item.value),
          productId: item.productId,
          quantity: item.quantity,
        });
      });
      const order = new Order({
        id: om.id,
        customerId: om.customerId,
        orderItems,
        createdAt: om.createdAt,
      });
      order.updateStatus(om.status as orderStatusDto);
      return order;
    });
  }

  async findAllWithoutFinishedAndOrderedByStatusAndCreateDate(
    customerIdQuery?: string,
    statusQuery?: string,
  ): Promise<Order[]> {
    const customerId = customerIdQuery ? { customerId: customerIdQuery } : {};
    const status = statusQuery ? { status: statusQuery } : {};
    const orderModels = await this.orderM.findAll({
      where: { 
        ...customerId,
        ...status,
        [Op.not]: {
          status: 'Finalizado'
        }
      },
      include: [
        {
          model: OrderItemModel,
          as: 'orderItems',
        },
      ],
      order: [
        [Sequelize.literal(`CASE 
          WHEN status = 'Pronto' THEN 1 
          WHEN status = 'Em preparação' THEN 2
          WHEN status = 'Recebido' THEN 3
          ELSE 4 END`),
          "ASC"
        ],
        ['createdAt', 'ASC']
      ],
    });

    if (orderModels.length < 1) return [];

    return orderModels.map((om) => {
      const orderItems = om.orderItems.map((item) => {
        return new OrderItem({
          id: item.id,
          value: Number(item.value),
          productId: item.productId,
          quantity: item.quantity,
        });
      });
      const order = new Order({
        id: om.id,
        customerId: om.customerId,
        orderItems,
        createdAt: om.createdAt,
      });
      order.updateStatus(om.status as orderStatusDto);
      return order;
    });
  }

  async create(entity: Order): Promise<void> {
    const orderModel = await this.orderM.create({
      id: entity.id,
      customerId: entity.customerId,
      total: entity.total,
      status: entity.status,
      createdAt: entity.createdAt
    });

    await Promise.all(
      entity.orderItems.map(async (item) => {
        return this.orderItemM.create({
          id: item.id,
          productId: item.productId,
          orderId: orderModel.id,
          value: Number(item.value),
          quantity: item.quantity,
        });
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.orderM.destroy({ where: { id } });
  }

  async update(id: string, { customerId }: Partial<Order>): Promise<void> {
    await this.orderM.update({ customerId }, { where: { id } });
  }
}
