import { PartialType } from "@nestjs/swagger"
import { IsOptional, IsString, IsArray } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsArray()
  skills?: string[];
}