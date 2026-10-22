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
import { CreateProfileDto } from './dto/create-profile.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ProfileService } from './profile.service.js';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) {}

  @Get()
  async findOne() {
    const data = await this.profileService.findOne();

    return {
      success: true,
      message: 'Profil berhasil diambil',
      data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async create(
    @Body() createProfileDto: CreateProfileDto,
  ) {
    const data =
      await this.profileService.create(createProfileDto);

    return {
      success: true,
      message: 'Profil berhasil dibuat',
      data,
    };
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async update(
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const data =
      await this.profileService.update(updateProfileDto);

    return {
      success: true,
      message: 'Profil berhasil diperbarui',
      data,
    };
  }
}