import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  laborerId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Assist with rice harvesting' })
  description: string;
}
