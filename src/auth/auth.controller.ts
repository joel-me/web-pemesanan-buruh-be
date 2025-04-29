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
  async login(@Body() loginDto: LoginDto) {  // Use LoginDto here
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    return this.authService.login(user); // Menghasilkan token JWT setelah login sukses
  }

  // Endpoint untuk registrasi farmer
  @Post('register/farmer')
  @ApiOperation({ summary: 'Register a new farmer' })
  @ApiResponse({ status: 201, description: 'Farmer registered successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid registration data.' })
  registerFarmer(@Body() dto: RegisterFarmerDto) {
    return this.authService.registerFarmer(dto); // Mendaftar farmer
  }

  // Endpoint untuk registrasi laborer
  @Post('register/laborer')
  @ApiOperation({ summary: 'Register a new laborer' })
  @ApiResponse({ status: 201, description: 'Laborer registered successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid registration data.' })
  registerLaborer(@Body() dto: RegisterLaborerDto) {
    return this.authService.registerLaborer(dto); // Mendaftar laborer
  }
}
