import type IUserRepository from "../../application/interfaces/iUserRepository";
import type User from "../../domain/entities/user";

class UserRepository implements IUserRepository {
  private users: User[] = [];

  async getUserById(id: number): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    return user || null;
  }

  async createUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async updateUser(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      return user;
    }
    throw new Error("User not found");
  }

  async deleteUser(id: number): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }
}

export default UserRepository;
