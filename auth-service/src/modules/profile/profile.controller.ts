import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { OwnerOfProfileOrAdminGuard } from '../../common/guards/owner-profile.guard';

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


    @UseGuards(JwtAuthGuard, OwnerOfProfileOrAdminGuard)
    @Put(':id')
    updateProfile(@Param('id') profileId: string, @Body() updateDTO: UpdateProfileDto) {
        return this.profileService.updateProfile(profileId, updateDTO);
    }

    @UseGuards(JwtAuthGuard, OwnerOfProfileOrAdminGuard)
    @Delete(':id')
    deleteProfile(@Param('id') profileId: string) {
        return this.profileService.deleteProfile(profileId);
    }
}
