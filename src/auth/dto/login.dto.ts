import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password minimal harus 6 karakter' })
  password: string;
}
