import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { OwnerOfProfileOrAdminGuard } from '../../common/guards/owner-profile.guard';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @UseInterceptors(FileInterceptor('avatar'))
    async createProfile(
        @Body() profile: CreateProfileDto,
        @UploadedFile() avatar?: Express.Multer.File,
    ) {
        return this.profileService.createProfile(profile, avatar);
    }

    @UseGuards(JwtAuthGuard, OwnerOfProfileOrAdminGuard)
    @Put(':id')
    @UseInterceptors(FileInterceptor('avatar'))
    updateProfile(@Param('id') profileId: string, @Body() updateDTO: UpdateProfileDto, @UploadedFile() avatar?: Express.Multer.File) {
        return this.profileService.updateProfile(profileId, updateDTO, avatar);
    }

    @UseGuards(JwtAuthGuard, OwnerOfProfileOrAdminGuard)
    @Delete(':id')
    deleteProfile(@Param('id') profileId: string) {
        return this.profileService.deleteProfile(profileId);
    }
}
