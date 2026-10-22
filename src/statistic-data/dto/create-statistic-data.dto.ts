import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';

export class CreateStatisticDataDto {
  @IsInt()
  statisticId: number;

  @IsInt()
  year: number;

  @IsNotEmpty()
  @IsNumberString()
  value: string;
}