import { IRepository } from 'src/internal/application/ports/repositories/repository';

import { Order } from '../entities/order.entity';
export interface ITotalReport {
  purchases: number;
  value: number;
}
export interface IOrderRepository extends IRepository<Order> {
  findAll(customerId?: string, status?: string): Promise<Order[] | null>;
  findAllWithoutFinishedAndOrderedByStatusAndCreateDate(customerId?: string, status?: string): Promise<Order[] | null>;
  changeStatus(orderId: string, status: string): Promise<void>;
  getReportByCustomer(customerId: string): Promise<ITotalReport>;
  getStatus(id: string): Promise<{ status: string }>;
}
