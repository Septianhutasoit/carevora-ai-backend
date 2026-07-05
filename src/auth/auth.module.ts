import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // Konfigurasi token JWT agar berlaku selama 1 hari (24h)
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'ganti_dengan_kode_rahasia_opsional',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
