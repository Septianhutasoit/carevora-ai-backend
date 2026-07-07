import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { UploadsModule } from './uploads.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    SkillsModule,
    CareersModule,
    RecommendationsModule,
    UploadsModule, // Tambahkan modul ini di sini agar terdaftar aktif
  ],
})
export class UploadsModule {}
