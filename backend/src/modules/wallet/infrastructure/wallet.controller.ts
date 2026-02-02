import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { RechargeWalletUseCase } from '../application/recharge-wallet.use-case';
import { RequestPaymentUseCase } from '../application/request-payment.use-case';
import { ConfirmPaymentUseCase } from '../application/confirm-payment.use-case';
import { GetBalanceQuery } from '../application/get-balance.query';
import { RechargeWalletDto } from '../application/dto/recharge-wallet.dto';
import { RequestPaymentDto } from '../application/dto/request-payment.dto';
import { ConfirmPaymentDto } from '../application/dto/confirm-payment.dto';
import { GetBalanceDto } from '../application/dto/get-balance.dto';
import { IdempotencyInterceptor } from '@shared/infrastructure/interceptors/idempotency.interceptor';
import { WalletControllerName, WalletRoutes } from '@shared/infrastructure/constants/wallet-routes.constants';
import { WalletMapper } from './mappers/wallet.mapper';

@Controller(WalletControllerName)
export class WalletController {
    constructor(
        private readonly rechargeUseCase: RechargeWalletUseCase,
        private readonly requestPaymentUseCase: RequestPaymentUseCase,
        private readonly confirmPaymentUseCase: ConfirmPaymentUseCase,
        private readonly getBalanceQuery: GetBalanceQuery,
    ) { }

    @Post(WalletRoutes.RECHARGE)
    @UseInterceptors(IdempotencyInterceptor)
    async recharge(@Body() dto: RechargeWalletDto) {
        const wallet = await this.rechargeUseCase.execute(dto);
        return WalletMapper.toResponse(wallet);
    }

    @Post(WalletRoutes.PAY_REQUEST)
    async requestPayment(@Body() dto: RequestPaymentDto) {
        return this.requestPaymentUseCase.execute(dto);
    }

    @Post(WalletRoutes.PAY_CONFIRM)
    @UseInterceptors(IdempotencyInterceptor)
    async confirmPayment(@Body() dto: ConfirmPaymentDto) {
        const wallet = await this.confirmPaymentUseCase.execute(dto);
        return WalletMapper.toResponse(wallet);
    }

    @Get(WalletRoutes.BALANCE)
    async getBalance(@Query() dto: GetBalanceDto) {
        const wallet = await this.getBalanceQuery.execute(dto);
        if (!wallet) return { balance: 0 };
        return WalletMapper.toResponse(wallet);
    }
}
