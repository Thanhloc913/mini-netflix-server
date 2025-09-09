import { AccountRole } from './account-role.enum';

export type CreateAccountDto = {
  email: string;
  password: string;
  role: AccountRole;
};

export type UpdateAccountDto = {
  email: string;
  password: string;
  updatedAt: Date | null;
};
