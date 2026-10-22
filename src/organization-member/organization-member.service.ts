import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { db } from '../prisma/db.js';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto.js';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto.js';

@Injectable()
export class OrganizationMemberService {
  async findAll() {
    const members =
      await db.orm.public.OrganizationMember.all();

    return members.sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  }

  async findOne(id: number) {
    const member =
      await db.orm.public.OrganizationMember
        .where({ id })
        .first();

    if (!member) {
      throw new NotFoundException(
        'Anggota organisasi tidak ditemukan',
      );
    }

    return member;
  }

  async create(
    createOrganizationMemberDto: CreateOrganizationMemberDto,
  ) {
    const profile =
      await db.orm.public.Profile
        .where({
          id: createOrganizationMemberDto.profileId,
        })
        .first();

    if (!profile) {
      throw new NotFoundException(
        'Profil tidak ditemukan',
      );
    }

    return db.orm.public.OrganizationMember.create({
      profileId: createOrganizationMemberDto.profileId,
      name: createOrganizationMemberDto.name,
      position: createOrganizationMemberDto.position,
      photo: createOrganizationMemberDto.photo,
      sortOrder:
        createOrganizationMemberDto.sortOrder ?? 0,
    });
  }

  async update(
    id: number,
    updateOrganizationMemberDto: UpdateOrganizationMemberDto,
  ) {
    const existing = await this.findOne(id);

    if (
      updateOrganizationMemberDto.profileId !== undefined
    ) {
      const profile =
        await db.orm.public.Profile
          .where({
            id: updateOrganizationMemberDto.profileId,
          })
          .first();

      if (!profile) {
        throw new NotFoundException(
          'Profil tidak ditemukan',
        );
      }
    }

    const updateData: Record<string, unknown> = {};

    if (
      updateOrganizationMemberDto.profileId !== undefined
    ) {
      updateData.profileId =
        updateOrganizationMemberDto.profileId;
    }

    if (updateOrganizationMemberDto.name !== undefined) {
      updateData.name =
        updateOrganizationMemberDto.name;
    }

    if (
      updateOrganizationMemberDto.position !== undefined
    ) {
      updateData.position =
        updateOrganizationMemberDto.position;
    }

    if (updateOrganizationMemberDto.photo !== undefined) {
      updateData.photo =
        updateOrganizationMemberDto.photo;
    }

    if (
      updateOrganizationMemberDto.sortOrder !== undefined
    ) {
      updateData.sortOrder =
        updateOrganizationMemberDto.sortOrder;
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(
        'Tidak ada data yang diperbarui',
      );
    }

    return db.orm.public.OrganizationMember
      .where({ id: existing.id })
      .update(updateData);
  }

  async remove(id: number) {
    const existing = await this.findOne(id);

    await db.orm.public.OrganizationMember
      .where({ id: existing.id })
      .delete();

    return {
      id: existing.id,
    };
  }
}
