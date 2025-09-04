import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountGrpcController } from './account.grpc.controller';

@Module({
  controllers: [AccountController, AccountGrpcController],
  providers: [AccountService],
  imports: [TypeOrmModule.forFeature([Account])],
  exports: [AccountService],
})
export class AccountModule {}
