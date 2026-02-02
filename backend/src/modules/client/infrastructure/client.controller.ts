import { Body, Controller, Post } from '@nestjs/common';
import { RegisterClientUseCase } from '../application/register-client.use-case';
import { RegisterClientDto } from '../application/dto/register-client.dto';
import { ClientControllerName, ClientRoutes } from '@shared/infrastructure/constants/client-routes.constants';
import { ClientMapper } from './mappers/client.mapper';

@Controller(ClientControllerName)
export class ClientController {
    constructor(private readonly registerClientUseCase: RegisterClientUseCase) { }

    @Post(ClientRoutes.REGISTER)
    async register(@Body() dto: RegisterClientDto) {
        const client = await this.registerClientUseCase.execute(dto);
        return ClientMapper.toResponse(client);
    }
}
