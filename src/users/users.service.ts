// src/users/users.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserType } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";  // pastikan import DTO

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Fungsi untuk membuat user baru
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  // Fungsi untuk mendapatkan semua user
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Fungsi untuk mendapatkan semua laborer (buruh)
  async findAllLaborers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { userType: UserType.LABORER },
      select: ["id", "username", "email", "skills", "createdAt", "updatedAt"],
    });
  }

  // Fungsi untuk mendapatkan user berdasarkan id
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Fungsi untuk mendapatkan user berdasarkan username
  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user || undefined;
  }

  // Fungsi untuk update user
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  // Fungsi untuk menghapus user
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
