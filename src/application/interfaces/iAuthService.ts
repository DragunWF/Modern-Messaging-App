import { UserCredential } from "firebase/auth";

export interface IAuthService {
  login(email: string, password: string): Promise<UserCredential>;
  register(email: string, password: string): Promise<UserCredential>;
  logout(): Promise<void>;
  getCurrentUserId(): string | null;
}
