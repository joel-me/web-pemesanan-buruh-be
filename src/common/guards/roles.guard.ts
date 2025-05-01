import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Mengambil roles yang dibutuhkan dari metadata
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Jika tidak ada role yang dibutuhkan, izinkan akses
    if (!requiredRoles) {
      return true;
    }

    // Ambil user dari request (dari JWT yang didecode)
    const { user } = context.switchToHttp().getRequest();

    // Pastikan user memiliki role yang dibutuhkan
    return requiredRoles.some((role) => user.role === role);
  }
}
