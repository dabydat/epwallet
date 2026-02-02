import { IsNotEmpty, IsString } from 'class-validator';

export class GetBalanceDto {
    @IsString()
    @IsNotEmpty()
    document: string;

    @IsString()
    @IsNotEmpty()
    phone: string;
}
