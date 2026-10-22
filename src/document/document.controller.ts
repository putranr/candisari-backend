import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { DocumentService } from './document.service.js';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
  ) {}

  // Admin: lihat semua dokumen, termasuk draf.
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async findAllAdmin() {
    const documents = await this.documentService.findAll();

    return {
      success: true,
      message: 'Daftar dokumen admin berhasil diambil',
      data: documents,
    };
  }

  // Admin: lihat detail dokumen, termasuk draf.
  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    const document = await this.documentService.findOne(id);

    return {
      success: true,
      message: 'Detail dokumen admin berhasil diambil',
      data: document,
    };
  }

  // Publik: hanya dokumen yang sudah waktunya terbit.
  @Get()
  async findAll() {
    const documents = await this.documentService.findAllPublished();

    return {
      success: true,
      message: 'Daftar dokumen berhasil diambil',
      data: documents,
    };
  }

  // Publik: draf dan dokumen terjadwal tidak bisa diakses.
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const document = await this.documentService.findOnePublished(id);

    return {
      success: true,
      message: 'Detail dokumen berhasil diambil',
      data: document,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @Req() req: any,
  ) {
    const document = await this.documentService.create(
      createDocumentDto,
      req.user.id,
    );

    return {
      success: true,
      message: 'Dokumen berhasil dibuat',
      data: document,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateDocumentDto>,
  ) {
    const document = await this.documentService.update(id, updateData);

    return {
      success: true,
      message: 'Dokumen berhasil diperbarui',
      data: document,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const document = await this.documentService.remove(id);

    return {
      success: true,
      message: 'Dokumen berhasil dihapus',
      data: document,
    };
  }
}
