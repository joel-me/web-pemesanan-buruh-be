// src/users/users.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserType } from "./entities/user.entity";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Register User baru
  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User successfully created" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Dapatkan semua laborers (buruh) oleh petani
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.FARMER)  // hanya petani yang dapat mengakses
  @Get("laborers")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all laborers (Farmer only)" })
  @ApiResponse({ status: 200, description: "Return all laborers" })
  @ApiResponse({ status: 403, description: "Forbidden - User is not a farmer" })
  findAllLaborers() {
    return this.usersService.findAllLaborers();
  }

  // Dapatkan user berdasarkan id
  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User found" })
  @ApiResponse({ status: 404, description: "User not found" })
  findOne(@Param("id") id: number) {
    return this.usersService.findOne(id);
  }

  // Update user
  @Put(":id")
  @ApiOperation({ summary: "Update user" })
  @ApiResponse({ status: 200, description: "User updated" })
  update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // Hapus user
  @Delete(":id")
  @ApiOperation({ summary: "Delete user" })
  @ApiResponse({ status: 200, description: "User deleted" })
  remove(@Param("id") id: number) {
    return this.usersService.remove(id);
  }
}
