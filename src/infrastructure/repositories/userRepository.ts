import {
  ref,
  get,
  set,
  child,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  onDisconnect,
  onValue,
  off,
} from "firebase/database";
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

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const dbRef = ref(rtdb, UserRepository.collectionName);
      const usernameQuery = query(
        dbRef,
        orderByChild("username"),
        equalTo(username)
      );
      const snapshot = await get(usernameQuery);

      if (snapshot.exists()) {
        const users = snapshot.val();
        // snapshot.val() returns an object where keys are UIDs and values are User objects.
        // Since usernames should be unique (we should enforce this during registration), we take the first one.
        const userId = Object.keys(users)[0];
        return users[userId] as User;
      }
      return null;
    } catch (error) {
      console.error("Error getting user by username:", error);
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

  async getFriendsOfUser(userId: string): Promise<User[]> {
    try {
      const user = await this.getUserById(userId);
      if (!user || !user.friends || user.friends.length === 0) {
        return [];
      }

      const friendsPromises = user.friends.map((friendId) =>
        this.getUserById(friendId)
      );
      const friends = await Promise.all(friendsPromises);

      return friends.filter((friend): friend is User => friend !== null);
    } catch (error) {
      console.error("Error getting friends of user:", error);
      throw error;
    }
  }

  initializePresence(userId: string): void {
    const connectedRef = ref(rtdb, ".info/connected");
    const userStatusRef = ref(
      rtdb,
      `${UserRepository.collectionName}/${userId}`
    );

    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // When I disconnect, update the status to offline
        onDisconnect(userStatusRef)
          .update({ isOnline: false })
          .then(() => {
            // We're connected (or reconnected)! Set status to online
            update(userStatusRef, { isOnline: true });
          });
      }
    });
  }

  subscribeToFriends(
    userId: string,
    callback: (friends: User[]) => void
  ): () => void {
    const dbRef = ref(rtdb);
    let friendListeners: Array<{ ref: any; callback: any }> = [];
    let isUnsubscribed = false;

    // First, get the user's friend list
    get(child(dbRef, `${UserRepository.collectionName}/${userId}/friends`))
      .then((snapshot) => {
        if (isUnsubscribed) return;

        if (!snapshot.exists()) {
          callback([]);
          return;
        }

        const friendIds = snapshot.val() as string[];
        if (!friendIds || friendIds.length === 0) {
          callback([]);
          return;
        }

        const friendsMap = new Map<string, User>();

        friendIds.forEach((friendId) => {
          const friendRef = child(
            dbRef,
            `${UserRepository.collectionName}/${friendId}`
          );

          const onFriendChange = (friendSnap: any) => {
            if (friendSnap.exists()) {
              const friendData = friendSnap.val() as User;
              friendsMap.set(friendId, friendData);
            } else {
              friendsMap.delete(friendId);
            }
            callback(Array.from(friendsMap.values()));
          };

          onValue(friendRef, onFriendChange);
          friendListeners.push({ ref: friendRef, callback: onFriendChange });
        });
      })
      .catch((err) => console.error("Error subscribing to friends", err));

    return () => {
      isUnsubscribed = true;
      friendListeners.forEach((listener) => {
        off(listener.ref, "value", listener.callback);
      });
    };
  }
}

export default UserRepository;
