import { Payment } from '../entities/payment.entity';

export class CreatedPaymentEvent {
  constructor(public payment: Payment) {}
}
