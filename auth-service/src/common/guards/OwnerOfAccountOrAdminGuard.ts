import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OwnerOfAccountOrAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const accountId = request.params.id;

    if (user.role === 'ADMIN') {
      return true;
    }

    return accountId === user.userId;
  }
}
