import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileSectionDto } from './create-profile-section.dto.js';

export class UpdateProfileSectionDto extends PartialType(
  CreateProfileSectionDto,
) {}
