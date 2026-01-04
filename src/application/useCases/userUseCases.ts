import { IAuthService } from "../interfaces/iAuthService";
import IUserRepository from "../interfaces/iUserRepository";
import User from "../../domain/entities/user";
import { UserCredential } from "firebase/auth";

export class UserUseCases {
  constructor(
    private authService: IAuthService,
    private userRepository: IUserRepository
  ) {}

  async registerUser(
    email: string,
    password: string,
    username: string
  ): Promise<User> {
    try {
      // 1. Register in Firebase Auth
      const userCredential: UserCredential = await this.authService.register(
        email,
        password
      );
      const uid = userCredential.user.uid;

      // 2. Create User Entity
      const newUser: User = {
        id: uid,
        username: username,
        email: email,
        password: "", // Don't store password in the database
        isOnline: true,
        friends: [],
      };

      // 3. Save to Repository
      await this.userRepository.createUser(newUser);

      return newUser;
    } catch (error) {
      console.error("Error in registerUser use case:", error);
      throw error;
    }
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      // 1. Login with Firebase Auth
      const userCredential = await this.authService.login(email, password);
      const uid = userCredential.user.uid;

      // 2. Retrieve User Profile
      const user = await this.userRepository.getUserById(uid);

      return user;
    } catch (error) {
      console.error("Error in loginUser use case:", error);
      throw error;
    }
  }

  async logoutUser(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error("Error in logoutUser use case:", error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const uid = this.authService.getCurrentUserId();
      if (!uid) return null;
      return await this.userRepository.getUserById(uid);
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.getAllUsers();
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }
}
