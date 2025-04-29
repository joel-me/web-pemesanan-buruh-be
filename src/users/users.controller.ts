import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { UsersService } from "./users.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../common/guards/roles.guard"
import { Roles } from "../common/decorators/roles.decorator"
import { UserType } from "./entities/user.entity"

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.FARMER)
  @Get("laborers")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all laborers (Farmer only)" })
  @ApiResponse({ status: 200, description: "Return all laborers" })
  @ApiResponse({ status: 403, description: "Forbidden - User is not a farmer" })
  findAllLaborers() {
    return this.usersService.findAllLaborers()
  }
}
