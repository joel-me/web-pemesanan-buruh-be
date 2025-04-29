import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class RegisterLaborerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "laborer_mike" })
  username: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "password123" })
  password: string

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: "mike@labor.com" })
  email: string

  @IsOptional()
  @ApiProperty({ example: ["harvesting", "planting"], required: false })
  skills?: string[]
}
