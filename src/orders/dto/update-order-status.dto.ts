import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty } from "class-validator"
import { OrderStatus } from "../entities/order.entity"

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.ACCEPTED })
  status: OrderStatus
}
