import { IsOptional, IsString } from 'class-validator';

export class UpdateNewsCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;
}
