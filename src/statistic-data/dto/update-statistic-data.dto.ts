import {
  IsInt,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class UpdateStatisticDataDto {
  @IsOptional()
  @IsInt()
  statisticId?: number;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsNumberString()
  value?: string;
}