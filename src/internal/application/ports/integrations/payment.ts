import { IPayment } from 'src/internal/domain/payment/entities/payment.entity';

export interface IRefreshToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
  userId: number;
  refreshToken: string;
  publicKey: string;
}

export interface IPaymentResult {
  id: string;
  status: string;
  qrCode: string;
  url: string;
}

export interface IPaymentIntegration {
  createPayment(payment: Partial<IPayment>): Promise<IPaymentResult>;
  updatePayment(payment: IPayment, status: string): Promise<IPaymentResult>;
  getPayment(paymentId: string): Promise<IPaymentResult>;
}
