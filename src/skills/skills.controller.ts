// src/skills/skills.controller.ts
import { Controller, Get } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('skills') // Endpoint: http://localhost:3001/skills
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async findAll() {
    return this.skillsService.findAll();
  }
}
