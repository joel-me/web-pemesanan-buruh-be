import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Budi Setiawan" })
  name: string

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: "budi@example.com" })
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: "password123" })
  password: string
}
