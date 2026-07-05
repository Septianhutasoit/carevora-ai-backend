import { Module } from '@nestjs/common';
import { AiService } from './ai.service';

@Module({
  providers: [AiService],
  exports: [AiService], // Diekspor agar bisa di-import oleh module lain (RecommendationsModule)
})
export class AiModule {}
