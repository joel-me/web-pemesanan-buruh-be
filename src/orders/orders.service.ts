import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
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

  // Fungsi untuk membuat order baru
  async create(createOrderDto: CreateOrderDto, farmerId: number): Promise<Order> {
    // Validasi bahwa startDate tidak lebih besar dari endDate
    if (new Date(createOrderDto.startDate) > new Date(createOrderDto.endDate)) {
      throw new BadRequestException('Start date cannot be later than end date');
    }

    // Ambil data laborer dan farmer berdasarkan ID
    const laborer = await this.usersService.findOne(createOrderDto.laborerId);
    const farmer = await this.usersService.findOne(farmerId);

    // Membuat order baru
    const order = this.ordersRepository.create({
      description: createOrderDto.description,
      status: OrderStatus.PENDING,
      laborerId: laborer.id,
      farmerId: farmer.id,
      laborer: laborer,
      farmer: farmer,
    });

    // Menyimpan order ke database
    return this.ordersRepository.save(order);
  }

  // Fungsi untuk mendapatkan order berdasarkan ID laborer
  async findOrdersByLaborerId(laborerId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { laborerId },
      relations: ['farmer'],
    });
  }

  // Fungsi untuk mendapatkan order berdasarkan ID farmer
  async findOrdersByFarmerId(farmerId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { farmerId },
      relations: ['laborer'],
    });
  }

  // Fungsi untuk mendapatkan order berdasarkan ID
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

  // Fungsi untuk memperbarui status order
  async updateOrderStatus(id: number, status: OrderStatus, laborerId: number): Promise<Order> {
    const order = await this.findOne(id);

    if (order.laborerId !== laborerId) {
      throw new ForbiddenException('You can only update your own orders');
    }

    order.status = status;
    return this.ordersRepository.save(order);
  }
}
