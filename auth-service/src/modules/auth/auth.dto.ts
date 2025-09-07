import { AccountRole } from "../accounts/account-role.enum";

export class LoginDto {
  email: string;
  password: string;
}
export class RegisterDto {
  email: string;
  password: string;
  role: AccountRole;
  name: string;
}
