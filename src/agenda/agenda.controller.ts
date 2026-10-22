import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AgendaService } from './agenda.service.js';
import { CreateAgendaDto } from './dto/create-agenda.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('agenda')
export class AgendaController {
  constructor(
    private readonly agendaService: AgendaService,
  ) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async findAllAdmin() {
    return {
      success: true,
      message: 'Daftar agenda admin berhasil diambil',
      data: await this.agendaService.findAllAdmin(),
    };
  }

  @Get('admin/:slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async findOneAdmin(@Param('slug') slug: string) {
    return {
      success: true,
      message: 'Detail agenda admin berhasil diambil',
      data: await this.agendaService.findOneAdmin(slug),
    };
  }

  @Get()
  async findAll() {
    return {
      success: true,
      message: 'Daftar agenda berhasil diambil',
      data: await this.agendaService.findAll(),
    };
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return {
      success: true,
      message: 'Detail agenda berhasil diambil',
      data: await this.agendaService.findOne(slug),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async create(
    @Body() createAgendaDto: CreateAgendaDto,
    @Req() req: any,
  ) {
    return {
      success: true,
      message: 'Agenda berhasil dibuat',
      data: await this.agendaService.create(
        createAgendaDto,
        req.user.id,
      ),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateAgendaDto>,
  ) {
    return {
      success: true,
      message: 'Agenda berhasil diperbarui',
      data: await this.agendaService.update(
        Number(id),
        updateData,
      ),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async remove(@Param('id') id: string) {
    return {
      success: true,
      message: 'Agenda berhasil dihapus',
      data: await this.agendaService.remove(Number(id)),
    };
  }
}