import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChangedOrderStatusEvent } from 'src/internal/domain/checkout/events/order-status-changed.event';
import { IOrderRepository } from 'src/internal/domain/checkout/repositories/order.repository';

@Injectable()
export class ChangeOrderStatusListener {
  constructor(
    @Inject('OrderRepository')
    private orderRepository: IOrderRepository,
  ) {}

  @OnEvent('order-status.changed')
  async handle(event: ChangedOrderStatusEvent) {
    const { orderId, status } = event.data;
    if (status === 'Pronto') console.log('Finished.');
    await this.orderRepository.changeStatus(orderId, status);
  }
}
