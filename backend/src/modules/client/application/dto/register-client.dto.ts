import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterClientDto {
    @IsString()
    @IsNotEmpty()
    document: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;
}
