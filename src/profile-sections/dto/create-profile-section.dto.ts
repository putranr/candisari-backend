import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProfileSectionDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug!: string;

  @IsString()
  @MinLength(1)
  sectionType!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsString()
  @MinLength(1)
  content!: string;

  @IsOptional()
  @IsUrl()
  coverImage?: string;
}
