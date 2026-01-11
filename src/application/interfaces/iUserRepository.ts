import type User from "../../domain/entities/user";

export default interface IUserRepository {
  getUserById(id: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  getFriendsOfUser(userId: string): Promise<User[]>;
  updateUserFriendsList(userId: string, friendIds: string[]): Promise<void>; // New method
  
  // Real-time Presence & Updates
  initializePresence(userId: string): void;
  subscribeToFriends(userId: string, callback: (friends: User[]) => void): () => void;
  subscribeToUser(userId: string, callback: (user: User | null) => void): () => void;
  updateLastRead(userId: string, chatId: string, timestamp: number): Promise<void>;
}
