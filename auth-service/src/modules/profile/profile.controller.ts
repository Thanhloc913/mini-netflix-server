import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnerOrAdminGuard } from '../auth/owner-or-admin.guard';
import { AdminGuard } from '../auth/admin.guard';
import { OwnerOfProfileOrAdminGuard } from '../auth/owner-profile.guard';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get()
    getAllProfile() {
        return this.profileService.getProfile();
    }

    @UseGuards(JwtAuthGuard, OwnerOfProfileOrAdminGuard)
    @Get(':id') // <-- id này là profileId
    getProfile(@Param('id') profileId: string) {
        return this.profileService.getProfileById(profileId);
    }


    @Post()
    createProfile(@Body() profile: CreateProfileDto) {
        return this.profileService.createProfile(profile);
    }
}
