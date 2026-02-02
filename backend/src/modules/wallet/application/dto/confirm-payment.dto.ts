import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ConfirmPaymentDto {
    @IsString()
    @IsNotEmpty()
    sessionId: string;

    @IsString()
    @Length(6, 6)
    token: string;
}
