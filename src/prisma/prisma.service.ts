// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    // Hubungkan ke database saat modul NestJS diinisialisasi
    async onModuleInit() {
        await this.$connect();
    }

    // Putuskan koneksi database secara aman saat modul NestJS dihancurkan (aplikasi mati)
    async onModuleDestroy() {
        await this.$disconnect();
    }
}