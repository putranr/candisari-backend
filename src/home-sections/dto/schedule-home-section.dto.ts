import { IsISO8601 } from 'class-validator';

export class ScheduleHomeSectionDto {
  @IsISO8601()
  scheduledAt: string;
}