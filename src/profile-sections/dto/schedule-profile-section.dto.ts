import { IsDateString } from 'class-validator';

export class ScheduleProfileSectionDto {
  @IsDateString()
  scheduledAt!: string;
}
