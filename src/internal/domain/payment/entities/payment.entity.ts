import {
  AttributeException,
  DomainException,
} from 'src/internal/application/errors';
import { paymentStatusDto } from '../dto/payment-status.dto';

export interface IPayment {
  id: string;
  customerId: string;
  orderId: string;
  value: number;
  paymentType: string;
  status: string;
  qrCode: string;
  url: string;
}
type IConstructorDto = Omit<
  IPayment,
  'status' | 'qrCode' | 'paymentType' | 'url'
>;

export class Payment implements IPayment {
  id: string;
  customerId: string;
  orderId: string;
  value: number;
  paymentType: string;
  status: paymentStatusDto;
  qrCode: string;
  url: string;

  constructor(payment: IConstructorDto) {
    this.validate(payment);

    this.id = payment.id;
    this.customerId = payment.customerId;
    this.orderId = payment.orderId;
    this.value = Number(payment.value);
    this.status = 'Criado';
    this.paymentType = 'pix';
  }

  private validate(payment: IConstructorDto) {
    if (!payment.id) throw new AttributeException('id not found.');

    if (!payment.customerId)
      throw new DomainException('customerId is required.');

    if (!payment.orderId) throw new DomainException('orderId is required.');

    if (payment.value <= 0)
      throw new AttributeException('value must be a positive number.');
  }

  changeStatus(status: paymentStatusDto) {
    if (status === 'Pendente de pagamento') this.pending();

    if (status === 'Aprovado') this.approve();

    if (status === 'Cancelado') this.cancel();
  }

  private pending() {
    if (this.status !== 'Criado')
      throw new DomainException('payment was not created');
    this.status = 'Pendente de pagamento';
  }

  private approve() {
    if (this.status === 'Cancelado')
      throw new DomainException('payment was cancelled');
    this.status = 'Aprovado';
  }

  private cancel() {
    if (this.status === 'Aprovado')
      throw new DomainException('payment was approved');
    this.status = 'Cancelado';
  }

  setQrCode(qrCode: string) {
    this.qrCode = qrCode;
  }

  setUrl(url: string) {
    this.url = url;
  }
}
