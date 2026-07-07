// src/ai/ai.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

// Definisikan bentuk response data dari Python FastAPI
export interface AiRecommendationResponse {
  id: string;
  score: number;
}

@Injectable()
export class AiService {
  private readonly aiUrl =
    process.env.AI_SERVICE_URL || 'http://localhost:8000';

  async getRecommendations(
    userSkills: string[],
    careers: any[],
  ): Promise<AiRecommendationResponse[]> {
    // Mengembalikan Promise dengan tipe data spesifik
    try {
      const response = await axios.post<AiRecommendationResponse[]>(
        `${this.aiUrl}/recommend`,
        {
          user_skills: userSkills,
          careers: careers,
        },
      );
      return response.data;
    } catch {
      // Cukup tulis catch saja tanpa variabel jika tidak digunakan
      throw new HttpException(
        'AI Service (FastAPI) sedang offline, silakan nyalakan service Python Anda.',
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
  }
}
