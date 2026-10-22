import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'SUPER_ADMIN'])
  role?: 'ADMIN' | 'SUPER_ADMIN';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
