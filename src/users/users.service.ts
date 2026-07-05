// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 1. Mengambil profil user yang sedang login beserta skill miliknya
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    return user;
  }

  // 2. Mengambil daftar skill khusus yang dimiliki user tersebut
  async getUserSkills(userId: string) {
    const userSkills = await this.prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: true,
      },
    });

    // Kembalikan dalam bentuk list skill yang bersih
    return userSkills.map((us) => us.skill);
  }

  // 3. Menyimpan skill pilihan user ke database (menghapus yang lama, memasukkan yang baru)
  async saveUserSkills(userId: string, skillIds: string[]) {
    // Gunakan transaksi agar jika terjadi error di tengah jalan, database otomatis membatalkan perubahan (rollback)
    return this.prisma.$transaction(async (tx) => {
      // Hapus semua relasi skill lama milik user ini
      await tx.userSkill.deleteMany({
        where: { userId },
      });

      // Masukkan relasi skill baru
      const userSkillsData = skillIds.map((skillId) => ({
        userId,
        skillId,
      }));

      await tx.userSkill.createMany({
        data: userSkillsData,
      });
    });
  }
}
