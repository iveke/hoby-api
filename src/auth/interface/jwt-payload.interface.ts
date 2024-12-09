import { USER_ROLE } from "src/user/enum/user-role.enum";

export interface JwtPayload {
  id: string;
  email: string;
  role: USER_ROLE;
}
