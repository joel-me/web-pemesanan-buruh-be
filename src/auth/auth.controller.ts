import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // Import LoginDto
import { RegisterFarmerDto } from '../users/dto/register-farmer.dto';
import { RegisterLaborerDto } from '../users/dto/register-laborer.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint untuk login
  @Post('login')
  @ApiOperation({ summary: 'Login and receive JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful, JWT token returned.' })
  @ApiResponse({ status: 400, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginDto) {
    try {
      // Validasi kredensial
      const user = await this.authService.validateUser(loginDto.username, loginDto.password);
      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }
      
      // Menghasilkan token JWT setelah login sukses
      const response = await this.authService.login(user);
      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: response,
      };
    } catch (error) {
      // Menangani error dan memberi response yang lebih jelas
      throw new HttpException(
        error.response || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Endpoint untuk registrasi farmer
  @Post('register/farmer')
  @ApiOperation({ summary: 'Register a new farmer' })
  @ApiResponse({ status: 201, description: 'Farmer registered successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid registration data.' })
  async registerFarmer(@Body() dto: RegisterFarmerDto) {
    try {
      const response = await this.authService.registerFarmer(dto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Farmer registered successfully',
        data: response,
      };
    } catch (error) {
      throw new HttpException(
        error.response || 'Failed to register farmer',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Endpoint untuk registrasi laborer
  @Post('register/laborer')
  @ApiOperation({ summary: 'Register a new laborer' })
  @ApiResponse({ status: 201, description: 'Laborer registered successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid registration data.' })
  async registerLaborer(@Body() dto: RegisterLaborerDto) {
    try {
      const response = await this.authService.registerLaborer(dto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Laborer registered successfully',
        data: response,
      };
    } catch (error) {
      throw new HttpException(
        error.response || 'Failed to register laborer',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
