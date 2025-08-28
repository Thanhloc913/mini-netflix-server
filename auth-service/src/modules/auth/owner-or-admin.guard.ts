import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const paramId = request.params.id;

    if (user.role === 'ADMIN') {
      return true;
    }

    return user.userId === paramId;
  }
}
