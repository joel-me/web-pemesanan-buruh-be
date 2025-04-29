import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { UserType } from "../entities/user.entity"

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "johndoe" })
  username: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "password123" })
  password: string

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: "john@example.com" })
  email: string

  @IsEnum(UserType)
  @IsNotEmpty()
  @ApiProperty({ enum: UserType, example: UserType.FARMER })
  userType: UserType

  @IsOptional()
  @ApiProperty({ example: ["harvesting", "planting"], required: false })
  skills?: string[]
}
