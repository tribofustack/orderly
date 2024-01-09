import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CreatedPaymentEvent } from 'src/internal/domain/payment/events/payment-created.event';
import { OrdersService } from '../../order.service';

@Processor('orders')
export class OrderConsumePayment {
  constructor(private readonly orderService: OrdersService) {}

  @Process('payment.created')
  async handle(job: Job<CreatedPaymentEvent>) {
    try {
      const { payment } = job.data;

      await this.orderService.pay(payment);
    } catch (err: any) {
      console.error(`\n OrderConsumePayment: ${err.message}`);
    }
  }
}
