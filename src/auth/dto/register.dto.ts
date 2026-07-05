// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail({}, { message: 'Format email tidak valid' })
    email: string;

    @IsNotEmpty()
    @MinLength(6, { message: 'Password minimal harus 6 karakter' })
    password: string;
}