import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AccountService } from './account.service';
import { AccountRole } from './account-role.enum';

@Controller()
export class AccountGrpcController {
  constructor(private readonly accountService: AccountService) {}

  // map với: rpc GetUser (GetUserRequest) returns (AccountResponse);
  @GrpcMethod('AccountService', 'GetUser')
  async getUser(data: { id: string }) {
    const user = await this.accountService.getUser(data.id);
    return { user }; // map với AccountResponse trong proto
  }

  @GrpcMethod('AccountService', 'GetAllUsers')
  async getAllUsers() {
    const users = await this.accountService.getAllUsers();
    return { users }; // map với AccountListResponse
  }

  @GrpcMethod('AccountService', 'CreateUser')
  async createUser(data: {
    email: string;
    password: string;
    role: AccountRole;
  }) {
    const user = await this.accountService.createUser(data);
    return { user };
  }

  @GrpcMethod('AccountService', 'UpdateUser')
  async updateUser(data: {
    id: string;
    email: string;
    password: string;
    updatedAt: string;
  }) {
    const user = await this.accountService.updateUser(data.id, {
      email: data.email,
      password: data.password,
      updatedAt: new Date(data.updatedAt),
    });
    return { user };
  }

  @GrpcMethod('AccountService', 'DeleteUser')
  async deleteUser(data: { id: string }) {
    await this.accountService.deleteUser(data.id);
    return { success: true, message: 'User deleted successfully' };
  }
}
