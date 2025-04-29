import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Mengambil roles yang diperlukan dari metadata
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Jika tidak ada roles yang diperlukan, maka akses diberikan
    if (!requiredRoles) {
      return true;
    }

    // Mengambil user dari request
    const { user } = context.switchToHttp().getRequest();
    
    // Memeriksa apakah role user ada dalam requiredRoles
    return requiredRoles.some((role) => user.userType === role);
  }
}
