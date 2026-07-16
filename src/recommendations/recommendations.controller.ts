import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('recommendations')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

// jalankan ulang kalkulasi AI baru
  @Get()
  async getRecommendations(@Req() req: RequestWithUser) {
    return this.recommendationsService.getRecommendations(req.user.sub);
  }

// Mengambil riwayat hasil analisis terakhir dari neon
@Get('history')
async getHistory(@Req() req: RequestWithUser) {
  return this.recommendationsService.getHistory(req.user.sub);
}

}
