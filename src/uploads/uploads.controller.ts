import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('uploads') // URL dasar: http://localhost:3001/uploads
@UseGuards(JwtAuthGuard) // Wajib login untuk upload CV
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('cv') // http://localhost:3001/uploads/cv
  @UseInterceptors(FileInterceptor('file')) // Interseptor untuk menangani multipart/form-data
  async uploadCv(
    @Req() req: RequestWithUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // Batasi maksimal 2 MB
          new FileTypeValidator({ fileType: 'application/pdf' }), // Hanya boleh file PDF
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const extractedSkills = await this.uploadsService.parseCvAndExtractSkills(
      req.user.sub,
      file.buffer, // Mengirimkan file dalam memori RAM (buffer) tanpa menyimpannya ke disk
    );

    return {
      message: 'CV berhasil dianalisis oleh sistem!',
      extractedSkills,
    };
  }
}
