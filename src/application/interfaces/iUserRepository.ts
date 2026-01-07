import type User from "../../domain/entities/user";

export default interface IUserRepository {
  getUserById(id: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  getFriendsOfUser(userId: string): Promise<User[]>;
}
