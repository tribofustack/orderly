import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import EventEmitter from 'events';
import { DomainException } from 'src/internal/application/errors';
import { IIdentifierGenerator } from 'src/internal/application/ports/tokens/id-generator';
import { CreateOrderDto } from 'src/internal/domain/checkout/dto/create-order.dto';
import { OrderItem } from 'src/internal/domain/checkout/entities/order-item.entity';
import { Order } from 'src/internal/domain/checkout/entities/order.entity';
import { CreatedOrderEvent } from 'src/internal/domain/checkout/events/order-created.event';
import { ChangedOrderStatusEvent } from 'src/internal/domain/checkout/events/order-status-changed.event';
import { IOrderRepository } from 'src/internal/domain/checkout/repositories/order.repository';
import { IPayment } from 'src/internal/domain/payment/entities/payment.entity';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('OrderRepository')
    private orderRepository: IOrderRepository,

    @Inject('EventEmitter')
    private eventEmitter: EventEmitter,

    @Inject('IdGenerator')
    private idGenerator: IIdentifierGenerator,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { products } = createOrderDto;

    const orderItems = products.map(product => {
      return new OrderItem({
        id: this.idGenerator.generate(),
        productId: product.id,
        quantity: product.quantity,
        value: product.price,
      });
    });
    const order = new Order({
      customerId: createOrderDto.customerId,
      id: this.idGenerator.generate(),
      orderItems,
    });

    this.eventEmitter.emit('order.created', new CreatedOrderEvent(order));

    return order;
  }

  async pay(payment: IPayment) {
    const order = await this.orderRepository.findOne(payment.orderId);
    if (!order) throw new NotFoundException('order not found');

    if (order.status !== 'Recebido')
      throw new DomainException('order status is invalid');

    if (payment.status !== 'Pendente de pagamento')
      throw new DomainException('payment must be done');

    this.eventEmitter.emit(
      'order-status.changed',
      new ChangedOrderStatusEvent({
        orderId: order.id,
        status: 'Pendente de pagamento',
      }),
    );
  }

  async prepare(orderId: string) {
    const order = await this.orderRepository.findOne(orderId);
    if (!order) throw new NotFoundException('order not found');

    if (order.status !== 'Pago')
      throw new DomainException('order status is invalid');

    this.eventEmitter.emit(
      'order-status.changed',
      new ChangedOrderStatusEvent({ orderId, status: 'Em preparação' }),
    );

    console.log('Preparing...');
    setTimeout(() => {
      this.eventEmitter.emit(
        'order-status.changed',
        new ChangedOrderStatusEvent({ orderId, status: 'Pronto' }),
      );
    }, 20000);
  }

  async withdrawn(orderId: string) {
    const order = await this.orderRepository.findOne(orderId);
    if (!order) throw new NotFoundException('order not found');

    if (order.status !== 'Pronto')
      throw new DomainException('order status is invalid');

    this.eventEmitter.emit(
      'order-status.changed',
      new ChangedOrderStatusEvent({ orderId, status: 'Finalizado' }),
    );
  }

  async findAll(customerId?: string, status?: string) {
    return this.orderRepository.findAllWithoutFinishedAndOrderedByStatusAndCreateDate(customerId, status);
  }
}
