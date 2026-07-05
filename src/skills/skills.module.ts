// src/skills/skills.module.ts
import { Module } from '@nestjs/common'; // Diubah dari '@nestjs/module'
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService],
})
export class SkillsModule {}
