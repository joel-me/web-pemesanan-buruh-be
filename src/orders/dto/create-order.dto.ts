import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'The ID of the laborer who will perform the task.' })
  laborerId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Assist with rice harvesting', description: 'A description of the work to be done.' })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 100000, description: 'The wage for the job in IDR.' })
  wage: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2025-05-01', description: 'The start date of the work.' })
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2025-05-05', description: 'The end date of the work.' })
  endDate: string;
}
