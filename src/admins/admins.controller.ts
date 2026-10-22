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
import { AdminsService } from './admins.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { UpdateAdminDto } from './dto/update-admin.dto.js';

@Controller('admins')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  async findAll() {
    return {
      success: true,
      message: 'Daftar admin berhasil diambil',
      data: await this.adminsService.findAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      success: true,
      message: 'Data admin berhasil diambil',
      data: await this.adminsService.findOne(id),
    };
  }

  @Post()
  async create(@Body() dto: CreateAdminDto) {
    return {
      success: true,
      message: 'Admin berhasil ditambahkan',
      data: await this.adminsService.create(dto),
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdminDto,
    @Req() req: any,
  ) {
    return {
      success: true,
      message: 'Data admin berhasil diperbarui',
      data: await this.adminsService.update(id, dto, req.user.id),
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isActive: boolean },
    @Req() req: any,
  ) {
    return {
      success: true,
      message: 'Status admin berhasil diperbarui',
      data: await this.adminsService.updateStatus(
        id,
        body.isActive,
        req.user.id,
      ),
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return {
      success: true,
      message: 'Admin berhasil dihapus',
      data: await this.adminsService.remove(id, req.user.id),
    };
  }
}
