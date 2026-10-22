import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStatisticDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  category?: string;
}