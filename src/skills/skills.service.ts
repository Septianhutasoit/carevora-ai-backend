import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  // Mengambil seluruh master data skill untuk ditampilkan di frontend
  async findAll() {
    return this.prisma.skill.findMany({
      orderBy: {
        name: 'asc', // Urutkan alfabetis A-Z
      },
    });
  }
}
