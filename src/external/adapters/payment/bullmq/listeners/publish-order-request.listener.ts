import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CreatedPaymentEvent } from 'src/internal/domain/payment/events/payment-created.event';

@Injectable()
export class PublishPaymentIntegrationListener {
  constructor(
    @InjectQueue('orders')
    private queue: Queue,
  ) {}

  @OnEvent('payment.created')
  async handle(event: CreatedPaymentEvent) {
    await this.queue.add('payment.created', event);
  }
}
