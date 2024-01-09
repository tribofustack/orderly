import EventEmitter from 'events';
import { Inject, Injectable } from '@nestjs/common';
import { IPaymentIntegration } from 'src/internal/application/ports/integrations/payment';
import { IOrder } from 'src/internal/domain/checkout/entities/order.entity';
import { Payment } from 'src/internal/domain/payment/entities/payment.entity';
import { IPaymentRepository } from 'src/internal/domain/payment/repositories/payment.repository';
import { CreatedPaymentEvent } from 'src/internal/domain/payment/events/payment-created.event';
import {
  DomainException,
  NotFoundException,
} from 'src/internal/application/errors';
import { ChangedPaymentStatusEvent } from 'src/internal/domain/payment/events/payment-status-changed.event';
import { ChangedOrderStatusEvent } from 'src/internal/domain/checkout/events/order-status-changed.event';
import { IIdentifierGenerator } from 'src/internal/application/ports/tokens/id-generator';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PaymentRepository')
    private paymentRepository: IPaymentRepository,
    @Inject('PaymentIntegration')
    private paymentIntegration: IPaymentIntegration,
    @Inject('EventEmitter')
    private eventEmitter: EventEmitter,
    @Inject('IdGenerator')
    private idGenerator: IIdentifierGenerator,
  ) {}

  async create(order: IOrder) {
    const payment = new Payment({
      id: this.idGenerator.generate(),
      customerId: order.customerId,
      orderId: order.id,
      value: order.total,
    });

    const { qrCode, status, url } = await this.paymentIntegration.createPayment(
      {
        value: payment.value,
        paymentType: 'pix',
      },
    );
    if (status !== 'pending')
      throw new DomainException('payment was cancelled');

    payment.setQrCode(qrCode);
    payment.setUrl(url);
    payment.changeStatus('Pendente de pagamento');

    await this.paymentRepository.create(payment);

    this.eventEmitter.emit('payment.created', new CreatedPaymentEvent(payment));
  }

  async approveByOrderId(orderId: string) {
    const payment = await this.paymentRepository.findOneByOrderId(orderId);
    if (!payment) throw new NotFoundException('payment not found');

    console.log('Paying...');
    // await this.paymentIntegration.updatePayment(payment, 'approved');

    setTimeout(() => {
      this.eventEmitter.emit(
        'payment-status.changed',
        new ChangedPaymentStatusEvent({
          paymentId: payment.id,
          status: 'Aprovado',
        }),
      );
      this.eventEmitter.emit(
        'order-status.changed',
        new ChangedOrderStatusEvent({
          orderId,
          status: 'Pago',
        }),
      );

      console.log('Paid.');
    }, 20000);
  }

  async cancelByOrderId(orderId: string) {
    const payment = await this.paymentRepository.findOneByOrderId(orderId);
    if (!payment) throw new NotFoundException('payment not found');

    console.log('Canceling...');

    if (payment.status === 'Aprovado')
      throw new DomainException('payment was approved');
    // await this.paymentIntegration.updatePayment(payment, 'cancelled');

    setTimeout(() => {
      this.eventEmitter.emit(
        'payment-status.changed',
        new ChangedPaymentStatusEvent({
          paymentId: payment.id,
          status: 'Cancelado',
        }),
      );
      this.eventEmitter.emit(
        'order-status.changed',
        new ChangedOrderStatusEvent({
          orderId,
          status: 'Cancelado',
        }),
      );
      console.log('Cancelled.');
    }, 20000);
  }

  async findOneByOrderId(orderId: string) {
    const payment = await this.paymentRepository.findOneByOrderId(orderId);
    if (!payment) throw new NotFoundException('payment not found');
    return payment;
  }
}
