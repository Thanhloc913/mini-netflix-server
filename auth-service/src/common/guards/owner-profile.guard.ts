import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ProfileService } from "../../modules/profile/profile.service";

@Injectable()
export class OwnerOfProfileOrAdminGuard implements CanActivate {
  constructor(private readonly profileService: ProfileService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const profileId = request.params.id;

    if (user.role === 'ADMIN') {
      return true;
    }

    // Lấy profile từ DB
    const profile = await this.profileService.getProfileById(profileId);
    if (!profile) return false;

    // So sánh accountId của profile với userId trong token
    return profile.accountId.id === user.userId;
  }
}
