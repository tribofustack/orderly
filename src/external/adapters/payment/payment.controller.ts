import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { responseError } from 'src/external/infra/errors/reponse.error';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('order/:id/approve')
  approve(@Param('id') id: string) {
    try {
      return this.paymentService.approveByOrderId(id);
    } catch (err) {
      return responseError(err);
    }
  }

  @Delete('order/:id/cancel')
  cancel(@Param('id') id: string) {
    try { 
      return this.paymentService.cancelByOrderId(id);
    } catch (err) {
      return responseError(err);
    }
  }

  @Get('order/:id')
  findOne(@Param('id') id: string) {
    try {
      return this.paymentService.findOneByOrderId(id);
    } catch (err) {
      return responseError(err);
    }
  }
}
