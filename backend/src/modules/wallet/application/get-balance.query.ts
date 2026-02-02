import { Inject, Injectable } from '@nestjs/common';
import { GetBalanceDto } from './dto/get-balance.dto';
import { WALLET_REPOSITORY, type WalletRepository } from '../domain/repositories/wallet.repository';
import { CLIENT_REPOSITORY, type ClientRepository } from '@modules/client/domain/repositories/client.repository';
import { ClientNotFoundException } from '@shared/domain/exceptions/client-not-found.exception';
import { PhoneDoesNotMatchException } from '@shared/domain/exceptions/phone-does-not-match.exception';
import { Wallet } from '../domain/models/wallet';
import { DocumentVO } from '@shared/domain/value-objects/document.vo';

@Injectable()
export class GetBalanceQuery {
    constructor(
        @Inject(WALLET_REPOSITORY)
        private readonly walletRepo: WalletRepository,
        @Inject(CLIENT_REPOSITORY)
        private readonly clientRepo: ClientRepository,
    ) { }

    async execute(dto: GetBalanceDto): Promise<Wallet | null> {
        const client = await this.clientRepo.findByDocument(DocumentVO.create(dto.document));
        if (!client) throw new ClientNotFoundException();
        if (client.phone.getValue !== dto.phone) throw new PhoneDoesNotMatchException();

        const wallet = await this.walletRepo.findByClientId(client.id.getValue);
        return wallet;
    }
}
