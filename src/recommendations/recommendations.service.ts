import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

// Definisikan tipe data hasil analisis secara jelas
export interface DetailedResult {
  careerId: string;
  careerTitle: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

@Injectable()
export class RecommendationsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async getRecommendations(userId: string): Promise<DetailedResult[]> {
    const userSkillsRelation = await this.prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
    });

    const userSkills = userSkillsRelation.map((us) => us.skill.name);

    if (userSkills.length === 0) {
      return [];
    }

    const allCareers = await this.prisma.career.findMany({
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });

    const careersPayload = allCareers.map((career) => ({
      id: career.id,
      title: career.title,
      skills: career.skills.map((cs) => cs.skill.name),
    }));

    const aiScores = await this.aiService.getRecommendations(
      userSkills,
      careersPayload,
    );

    // TypeScript kini tahu bahwa detailedResults adalah array dari DetailedResult
    const detailedResults: DetailedResult[] = aiScores.map((scoreObj) => {
      const career = allCareers.find((c) => c.id === scoreObj.id)!;
      const careerSkills = career.skills.map((cs) => cs.skill.name);

      const matchedSkills = careerSkills.filter((s) => userSkills.includes(s));
      const missingSkills = careerSkills.filter((s) => !userSkills.includes(s));

      return {
        careerId: career.id,
        careerTitle: career.title,
        score: scoreObj.score,
        matchedSkills,
        missingSkills,
      };
    });

    if (detailedResults.length > 0) {
      await this.prisma.$transaction(async (tx) => {
        await tx.recommendation.deleteMany({ where: { userId } });

        await tx.recommendation.createMany({
          data: detailedResults.map((res: DetailedResult) => ({
            userId,
            careerId: res.careerId,
            score: res.score,
            matchedSkills: res.matchedSkills,
            missingSkills: res.missingSkills,
          })),
        });
      });
    }

    return detailedResults;
  }
}
