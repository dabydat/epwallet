import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class RechargeWalletDto {
    @IsString()
    @IsNotEmpty()
    document: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsNumber()
    @IsPositive()
    amount: number;
}
