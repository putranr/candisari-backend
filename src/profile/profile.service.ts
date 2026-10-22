import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { CreateProfileDto } from './dto/create-profile.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class ProfileService {
  async findOne() {
    const profile = await db.orm.public.Profile.first({});

    if (!profile) {
      throw new NotFoundException(
        'Profil Kecamatan belum tersedia',
      );
    }

    return profile;
  }

  async create(createProfileDto: CreateProfileDto) {
    const existingProfile =
      await db.orm.public.Profile.first({});

    if (existingProfile) {
      return existingProfile;
    }

    return db.orm.public.Profile.create({
      about: createProfileDto.about,
      vision: createProfileDto.vision,
      mission: createProfileDto.mission,
      history: createProfileDto.history,
    });
  }

  async update(updateProfileDto: UpdateProfileDto) {
    const profile =
      await db.orm.public.Profile.first({});

    if (!profile) {
      throw new NotFoundException(
        'Profil Kecamatan belum tersedia',
      );
    }

    return db.orm.public.Profile
      .where({ id: profile.id })
      .update({
        ...updateProfileDto,
      });
  }
}