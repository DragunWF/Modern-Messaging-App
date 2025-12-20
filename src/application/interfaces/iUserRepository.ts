import type User from "../../domain/entities/user";

export default interface IUserRepository {
  getUserById(id: number): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: number): Promise<void>;
  getAllUsers(): Promise<User[]>;
}
