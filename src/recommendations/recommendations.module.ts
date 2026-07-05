import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { AiModule } from '../ai/ai.module'; // Kita import modul AI untuk kebutuhan pengolahan data

@Module({
  imports: [AiModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
})
export class RecommendationsModule {} // Mengekspor kelas RecommendationsModule secara resmi
