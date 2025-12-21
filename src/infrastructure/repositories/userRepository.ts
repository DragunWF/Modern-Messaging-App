import { ref, get, set, child, update, remove } from "firebase/database";
import { rtdb } from "../database/firebaseConfig";
import type IUserRepository from "../../application/interfaces/iUserRepository";
import type User from "../../domain/entities/user";

class UserRepository implements IUserRepository {
  private static collectionName = "users";

  async getUserById(id: string): Promise<User | null> {
    const dbRef = ref(rtdb);
    try {
      const snapshot = await get(
        child(dbRef, `${UserRepository.collectionName}/${id}`)
      );
      if (snapshot.exists()) {
        return snapshot.val() as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  async createUser(user: User): Promise<User> {
    try {
      await set(ref(rtdb, `${UserRepository.collectionName}/` + user.id), user);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      const updates: any = {};
      updates[`/${UserRepository.collectionName}/` + user.id] = user;
      await update(ref(rtdb), updates);
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await remove(ref(rtdb, `${UserRepository.collectionName}/` + id));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    const dbRef = ref(rtdb);
    try {
      const snapshot = await get(child(dbRef, UserRepository.collectionName));
      if (snapshot.exists()) {
        const usersDict = snapshot.val();
        return Object.values(usersDict);
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }
}

export default UserRepository;
