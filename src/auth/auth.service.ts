import { Injectable, ConflictException, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { RegisterFarmerDto } from "../users/dto/register-farmer.dto";
import { RegisterLaborerDto } from "../users/dto/register-laborer.dto";
import { UserType } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Validasi Pengguna
  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByUsername(username);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException("Error during user validation");
    }
  }

  // Login
  async login(user: any) {
    try {
      const payload = { username: user.username, sub: user.id, role: user.userType };
      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.userType, // mapping userType menjadi role
          skills: user.skills,
        },
        access_token: this.jwtService.sign(payload),
      };
      
    } catch (error) {
      throw new InternalServerErrorException("Error during login process");
    }
  }

  // Register Petani
  async registerFarmer(registerFarmerDto: RegisterFarmerDto) {
    try {
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
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // Pass through conflict errors
      }
      throw new InternalServerErrorException("Error during farmer registration");
    }
  }

  // Register Buruh
  async registerLaborer(registerLaborerDto: RegisterLaborerDto) {
    try {
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
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // Pass through conflict errors
      }
      throw new InternalServerErrorException("Error during laborer registration");
    }
  }
}
