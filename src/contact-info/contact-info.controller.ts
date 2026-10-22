import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateContactInfoDto } from './dto/create-contact-info.dto.js';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto.js';
import { ContactInfoService } from './contact-info.service.js';

@Controller('contact-info')
export class ContactInfoController {
  constructor(
    private readonly contactInfoService: ContactInfoService,
  ) {}

  @Get()
  async findOne() {
    const data =
      await this.contactInfoService.findOne();

    return {
      success: true,
      message: 'Informasi kontak berhasil diambil',
      data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async create(
    @Body()
    createContactInfoDto: CreateContactInfoDto,
  ) {
    const data =
      await this.contactInfoService.create(
        createContactInfoDto,
      );

    return {
      success: true,
      message: 'Informasi kontak berhasil dibuat',
      data,
    };
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async update(
    @Body()
    updateContactInfoDto: UpdateContactInfoDto,
  ) {
    const data =
      await this.contactInfoService.update(
        updateContactInfoDto,
      );

    return {
      success: true,
      message: 'Informasi kontak berhasil diperbarui',
      data,
    };
  }
}
