import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserType } from '../users/entities/user.entity';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 🔹 Create order (Farmer only)
  @Post()
  @Roles(UserType.FARMER)
  @ApiOperation({ summary: 'Create a new order (Farmer only)' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not a farmer' })
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  // 🔹 Get orders assigned to laborer
  @Get('my-orders')
  @Roles(UserType.LABORER)
  @ApiOperation({
    summary: 'Get all orders assigned to the logged-in laborer (Laborer only)',
  })
  @ApiResponse({ status: 200, description: 'Orders retrieved' })
  async findMyOrders(@Request() req) {
    return this.ordersService.findOrdersByLaborerId(req.user.id);
  }

  // 🔹 Get orders placed by farmer
  @Get('my-placed-orders')
  @Roles(UserType.FARMER)
  @ApiOperation({
    summary: 'Get all orders placed by the logged-in farmer (Farmer only)',
  })
  @ApiResponse({ status: 200, description: 'Orders retrieved' })
  async findMyPlacedOrders(@Request() req) {
    return this.ordersService.findOrdersByFarmerId(req.user.id);
  }

  // 🔹 Update order status (Laborer only)
  @Patch(':id/status')
  @Roles(UserType.LABORER)
  @ApiOperation({ summary: 'Update order status (Laborer only)' })
  @ApiResponse({ status: 200, description: 'Order updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Request() req,
  ) {
    try {
      return await this.ordersService.updateOrderStatus(
        +id,
        updateOrderStatusDto.status,
        req.user.id,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You can only update your own orders');
      } else {
        throw error;
      }
    }
  }

  // 🔹 (Optional) Get a single order by ID (for debug or admin)
  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID (for authorized users)' })
  @ApiResponse({ status: 200, description: 'Order retrieved' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }
}
