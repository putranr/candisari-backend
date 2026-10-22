import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateHomeSectionDto {
  @IsString()
  sectionKey: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsBoolean()
  isActive: boolean;

  @IsInt()
  @Min(1)
  sortOrder: number;
}