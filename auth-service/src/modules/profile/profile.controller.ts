import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './profile.dto';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    getMovie() {
        return this.profileService.getProfile();
    }

    @Post()
    createProfile(@Body() profile: CreateProfileDto) {
        return this.profileService.createProfile(profile);
    }
}
