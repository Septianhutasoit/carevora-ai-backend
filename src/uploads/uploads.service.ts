import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const pdfParse = require('pdf-parse') as (
  dataBuffer: Buffer,
) => Promise<{ text: string }>;

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}

  async parseCvAndExtractSkills(
    userId: string,
    fileBuffer: Buffer,
  ): Promise<string[]> {
    try {
      // 1. Ekstrak teks secara aman (TypeScript kini tahu hasilnya memiliki properti .text)
      const pdfData = await pdfParse(fileBuffer);
      const cvText = pdfData.text.toLowerCase();

      if (!cvText || cvText.trim().length === 0) {
        throw new BadRequestException('File PDF tidak terbaca atau kosong');
      }

      // 2. Ambil seluruh master skill dari DB
      const allSkills = await this.prisma.skill.findMany();
      const extractedSkillIds: string[] = [];
      const extractedSkillNames: string[] = [];

      // 3. Scan & Cocokkan kata kunci
      for (const skill of allSkills) {
        const escapedSkillName = skill.name.replace(
          /[-\/\\^$*+?.()|[\]{}]/g,
          '\\$&',
        );
        const regex = new RegExp(
          `\\b${escapedSkillName.toLowerCase()}\\b`,
          'gi',
        );

        if (regex.test(cvText)) {
          extractedSkillIds.push(skill.id);
          extractedSkillNames.push(skill.name);
        }
      }

      // 4. Simpan otomatis ke database relasi user
      if (extractedSkillIds.length > 0) {
        await this.prisma.$transaction(async (tx) => {
          await tx.userSkill.deleteMany({ where: { userId } });

          await tx.userSkill.createMany({
            data: extractedSkillIds.map((skillId) => ({
              userId,
              skillId,
            })),
          });
        });
      }

      return extractedSkillNames;
    } catch (error: unknown) {
      if (error instanceof BadRequestException) throw error;

      // Mengonversi pesan ke string secara aman guna menghindari warning linter
      const message =
        error instanceof Error ? error.message : 'Gagal memproses file PDF';
      throw new BadRequestException(message);
    }
  }
}
