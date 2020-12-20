import {
  Controller,
  Post, Query,
  Request, UploadedFile,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  upload(@Request() req, @UploadedFile() file: any, @Query('folder') folder: string): Promise<any> {
    console.log('FIle:## ', file);
    let filename = file.originalname;
    if (folder) {
      filename = `${folder}/${filename}`;
    }
    return this.filesService.uploadPublicFile(file.buffer, filename);
  }
}
