// src/careers/careers.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { CareersService } from './careers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('careers')
@UseGuards(JwtAuthGuard)
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Get()
  async findAll() {
    return this.careersService.findAll();
  }
}
