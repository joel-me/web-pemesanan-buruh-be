import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class RegisterFarmerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "farmer_john" })
  username: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "password123" })
  password: string

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: "john@farm.com" })
  email: string
}
