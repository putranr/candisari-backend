import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateOrganizationMemberDto {
  @IsInt()
  @Min(1)
  profileId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
