// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Membuat module ini bersifat Global agar tidak perlu di-import berulang kali di modul lain
@Module({
    providers: [PrismaService],
    exports: [PrismaService], // Ekspor agar bisa diakses oleh module lain
})
export class PrismaModule { }