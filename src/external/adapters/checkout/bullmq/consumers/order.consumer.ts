import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { CreatedOrderEvent } from 'src/internal/domain/checkout/events/order-created.event';
import { IOrderRepository } from 'src/internal/domain/checkout/repositories/order.repository';

@Processor('orders')
export class OrderConsumer {
  constructor(
    @Inject('OrderRepository')
    private orderRepository: IOrderRepository,
  ) {}

  @Process('order.requested')
  async handle(job: Job<CreatedOrderEvent>) {
    try {
      const { order } = job.data;

      await this.orderRepository.create(order);
    } catch (err: any) {
      console.error(`\n OrderConsumer: ${err.message}`);
    }
  }
}
