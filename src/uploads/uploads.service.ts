import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class UploadsService {
    constructor(private prisma: PrismaService) { }

    async parseCvAndExtractSkills(userId: string, fileBuffer: Buffer): Promise<string[]> {
        try {
            // 1. Ekstrak teks mentah dari file PDF CV yang diunggah
            const pdfData = await pdfParse(fileBuffer);
            const cvText = pdfData.text.toLowerCase(); // Ubah semua teks ke lowercase agar pencocokan tidak sensitif huruf

            if (!cvText || cvText.trim().length === 0) {
                throw new BadRequestException('File PDF tidak terbaca atau kosong');
            }

            // 2. Ambil seluruh master skill yang ada di database Neon
            const allSkills = await this.prisma.skill.findMany();
            const extractedSkillIds: string[] = [];
            const extractedSkillNames: string[] = [];

            // 3. Scan & Cocokkan apakah nama skill ada di dalam teks CV
            for (const skill of allSkills) {
                // Menggunakan regex untuk mencari kata kunci secara presisi (mencegah pencocokan kata yang terpotong)
                const escapedSkillName = skill.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape karakter khusus
                const regex = new RegExp(`\\b${escapedSkillName.toLowerCase()}\\b`, 'gi');

                if (regex.test(cvText)) {
                    extractedSkillIds.push(skill.id);
                    extractedSkillNames.push(skill.name);
                }
            }

            // 4. Jika ada skill yang terdeteksi, simpan otomatis ke profil pengguna
            if (extractedSkillIds.length > 0) {
                await this.prisma.$transaction(async (tx) => {
                    // Hapus skill lama milik user terlebih dahulu (opsi sinkronisasi penuh)
                    await tx.userSkill.deleteMany({ where: { userId } });

                    // Masukkan daftar skill baru hasil deteksi CV
                    await tx.userSkill.createMany({
                        data: extractedSkillIds.map((skillId) => ({
                            userId,
                            skillId,
                        })),
                    });
                });
            }

            // Kembalikan daftar nama skill yang sukses terdeteksi untuk diinfokan ke frontend
            return extractedSkillNames;
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            throw new BadRequestException('Gagal memproses file PDF, pastikan format PDF Anda valid.');
        }
    }
}