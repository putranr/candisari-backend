import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'SUPER_ADMIN'])
  role?: 'ADMIN' | 'SUPER_ADMIN';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
