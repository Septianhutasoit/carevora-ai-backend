// src/users/users.controller.ts
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Definisikan interface khusus agar TypeScript mengenali tipe data token JWT
interface RequestWithUser {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Get('skills')
  async getUserSkills(@Req() req: RequestWithUser) {
    return this.usersService.getUserSkills(req.user.sub);
  }

  @Post('skills')
  async saveUserSkills(
    @Req() req: RequestWithUser,
    @Body('skillIds') skillIds: string[],
  ) {
    await this.usersService.saveUserSkills(req.user.sub, skillIds);
    return { message: 'Daftar keahlian berhasil diperbarui' };
  }
}
