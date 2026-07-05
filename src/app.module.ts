// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SkillsModule } from './skills/skills.module';
import { CareersModule } from './careers/careers.module';
import { RecommendationsModule } from './recommendations/recommendations.module';

@Module({
  imports: [
    PrismaModule, // Mendaftarkan database Prisma secara global
    AuthModule, // Mendaftarkan modul login/register
    UsersModule, // Mendaftarkan modul profil dan skill user
    SkillsModule, // Mendaftarkan modul master data skill
    CareersModule, // Mendaftarkan modul master data karier
    RecommendationsModule, // Mendaftarkan modul kalkulasi kecocokan
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
