import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profiles } from './profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../accounts/account.entity';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { join } from 'path';
import { FileClientService } from '../../common/clients/file-client.service';

@Module({
  providers: [ProfileService, FileClientService],
  controllers: [ProfileController],
  imports: [
    TypeOrmModule.forFeature([Profiles, Account]),
    ClientsModule.register([
      {
        name: 'FILE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'file',
          protoPath: join(__dirname, '../../../proto/file.proto'),
          url: 'file-service:50052',
        },
      },
    ]),
  ],
})
export class ProfileModule {}

