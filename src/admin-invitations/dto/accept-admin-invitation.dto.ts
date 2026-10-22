import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AcceptAdminInvitationDto {
  @IsString()
  @Matches(/^[a-f0-9]{64}$/i)
  token!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword!: string;
}