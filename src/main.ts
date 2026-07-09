import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. AKTIFKAN CORS (Menghilangkan error pemblokiran di browser selamanya)
  app.enableCors();

  // 2. AKTIFKAN VALIDASI GLOBAL (Agar DTO class-validator bekerja memeriksa input user)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // 3. JALANKAN DI PORT 3001 (Menghindari bentrokan dengan Next.js port 3000)
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend server successfully running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Gagal menyalakan server backend:', err);
});