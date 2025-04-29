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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserType } from '../users/entities/user.entity';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard) // Apply JWT authentication globally to this controller
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Endpoint for creating a new order (Farmer only)
  @Post()
  @UseGuards(RolesGuard) // Ensure the user has the correct role
  @Roles(UserType.FARMER) // Only FARMER can create orders
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order (Farmer only)' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not a farmer' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    try {
      // Ensure the user is authorized and create the order
      return await this.ordersService.create(createOrderDto, req.user.id);
    } catch (error) {
      throw new ForbiddenException('Unable to create order, please ensure you are a farmer.');
    }
  }

  // Endpoint to get all orders assigned to the logged-in laborer
  @Get('my-orders')
  @UseGuards(RolesGuard)
  @Roles(UserType.LABORER) // Only LABORER can view their assigned orders
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all orders assigned to the logged-in laborer (Laborer only)',
  })
  @ApiResponse({ status: 200, description: 'Return all orders assigned to the laborer' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not a laborer' })
  async findMyOrders(@Request() req) {
    try {
      return await this.ordersService.findOrdersByLaborerId(req.user.id);
    } catch (error) {
      throw new ForbiddenException('Unable to fetch orders for this laborer.');
    }
  }

  // Endpoint to get all orders placed by the logged-in farmer
  @Get('my-placed-orders')
  @UseGuards(RolesGuard)
  @Roles(UserType.FARMER) // Only FARMER can view their placed orders
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all orders placed by the logged-in farmer (Farmer only)',
  })
  @ApiResponse({ status: 200, description: 'Return all orders placed by the farmer' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not a farmer' })
  async findMyPlacedOrders(@Request() req) {
    try {
      return await this.ordersService.findOrdersByFarmerId(req.user.id);
    } catch (error) {
      throw new ForbiddenException('Unable to fetch placed orders for this farmer.');
    }
  }

  // Endpoint to update the status of an order (Laborer only)
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserType.LABORER) // Only LABORER can update the status of orders they are assigned to
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the status of an order (Laborer only)' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - User is not a laborer' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid status update' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Request() req,
  ) {
    try {
      const updatedOrder = await this.ordersService.updateOrderStatus(
        +id, // Ensure the order ID is correctly passed
        updateOrderStatusDto.status, // New status for the order
        req.user.id, // Laborer's user ID
      );
      return updatedOrder;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException('You can only update your own orders');
      } else {
        throw error; // Re-throw any other unexpected errors
      }
    }
  }
}
