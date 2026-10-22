import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto.js';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto.js';
import { OrganizationMemberService } from './organization-member.service.js';

@Controller('organization-members')
export class OrganizationMemberController {
  constructor(
    private readonly organizationMemberService: OrganizationMemberService,
  ) {}

  @Get()
  async findAll() {
    const data =
      await this.organizationMemberService.findAll();

    return {
      success: true,
      message: 'Anggota organisasi berhasil diambil',
      data,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data =
      await this.organizationMemberService.findOne(id);

    return {
      success: true,
      message: 'Anggota organisasi berhasil diambil',
      data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async create(
    @Body()
    createOrganizationMemberDto: CreateOrganizationMemberDto,
  ) {
    const data =
      await this.organizationMemberService.create(
        createOrganizationMemberDto,
      );

    return {
      success: true,
      message: 'Anggota organisasi berhasil dibuat',
      data,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateOrganizationMemberDto: UpdateOrganizationMemberDto,
  ) {
    const data =
      await this.organizationMemberService.update(
        id,
        updateOrganizationMemberDto,
      );

    return {
      success: true,
      message: 'Anggota organisasi berhasil diperbarui',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data =
      await this.organizationMemberService.remove(id);

    return {
      success: true,
      message: 'Anggota organisasi berhasil dihapus',
      data,
    };
  }
}
