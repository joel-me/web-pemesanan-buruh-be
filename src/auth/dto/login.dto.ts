import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "johndoe" })
  username: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "password123" })
  password: string
}
