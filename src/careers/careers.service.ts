import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CareersService {
  constructor(private prisma: PrismaService) {}

  // Mengambil daftar semua karier beserta daftar skill pendukungnya
  async findAll() {
    return this.prisma.career.findMany({
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }
}
