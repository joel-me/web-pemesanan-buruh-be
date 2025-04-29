import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly usersService: UsersService,
  ) {}

  async create(createOrderDto: CreateOrderDto, farmerId: number): Promise<Order> {
    const laborer = await this.usersService.findOne(createOrderDto.laborerId);
    const farmer = await this.usersService.findOne(farmerId);

    const order = this.ordersRepository.create({
      description: createOrderDto.description,
      status: OrderStatus.PENDING,
      laborerId: laborer.id,
      farmerId: farmer.id,
      laborer: laborer,
      farmer: farmer,
    });

    return this.ordersRepository.save(order);
  }

  async findOrdersByLaborerId(laborerId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { laborerId },
      relations: ['farmer'],
    });
  }

  async findOrdersByFarmerId(farmerId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { farmerId },
      relations: ['laborer'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['farmer', 'laborer'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateOrderStatus(id: number, status: OrderStatus, laborerId: number): Promise<Order> {
    const order = await this.findOne(id);

    if (order.laborerId !== laborerId) {
      throw new ForbiddenException('You can only update your own orders');
    }

    order.status = status;
    return this.ordersRepository.save(order);
  }
}
