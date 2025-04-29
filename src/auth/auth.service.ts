import { Injectable, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"; // <-- pakai biasa, BUKAN import type
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service"; // <-- pakai biasa
import { RegisterFarmerDto } from "../users/dto/register-farmer.dto";
import { RegisterLaborerDto } from "../users/dto/register-laborer.dto";
import { UserType } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, userType: user.userType };
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        skills: user.skills,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerFarmer(registerFarmerDto: RegisterFarmerDto) {
    const existingUser = await this.usersService.findByUsername(registerFarmerDto.username);
    if (existingUser) {
      throw new ConflictException("Username already in use");
    }

    const hashedPassword = await bcrypt.hash(registerFarmerDto.password, 10);

    const newUser = await this.usersService.create({
      ...registerFarmerDto,
      password: hashedPassword,
      userType: UserType.FARMER,
    });

    const { password, ...result } = newUser;
    return result;
  }

  async registerLaborer(registerLaborerDto: RegisterLaborerDto) {
    const existingUser = await this.usersService.findByUsername(registerLaborerDto.username);
    if (existingUser) {
      throw new ConflictException("Username already in use");
    }

    const hashedPassword = await bcrypt.hash(registerLaborerDto.password, 10);

    const newUser = await this.usersService.create({
      ...registerLaborerDto,
      password: hashedPassword,
      userType: UserType.LABORER,
    });

    const { password, ...result } = newUser;
    return result;
  }
}
