import { PartialType } from '@nestjs/mapped-types';
import { CreateContactInfoDto } from './create-contact-info.dto.js';

export class UpdateContactInfoDto extends PartialType(
  CreateContactInfoDto,
) {}
